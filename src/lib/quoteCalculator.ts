/**
 * Quote Calculator - Pricing logic for moving estimates
 * Designed for future backend integration (database, CRM, email)
 */

// ============= Types =============

export interface QuoteInput {
  // Address info
  from_address?: string;
  to_address?: string;
  
  // Size (one required)
  area_m2?: number;
  rooms?: number;
  dwelling_type?: 'lagenhet' | 'villa' | 'radhus' | 'student';
  
  // Scheduling
  date?: string; // YYYY-MM-DD
  start_time?: string; // HH:MM
  
  // Logistics
  stairs_from?: number; // floors without elevator
  stairs_to?: number;
  carry_from_m?: number; // meters
  carry_to_m?: number;
  parking_restrictions?: boolean;
  
  // Heavy items
  heavy_items?: Array<'piano' | 'flygel' | 'safe150'>;
  
  // Additional services (RUT labor)
  packing_hours?: number;
  assembly_hours?: number;
  
  // Customer info
  rut_eligible?: boolean; // default true for private
  
  // Contact (for lead generation)
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  home_visit_requested?: boolean;
  gdpr_consent?: boolean;
}

export interface QuoteBreakdown {
  team: number; // number of movers
  labor_hours: number;
  hourly: number; // hourly rate after RUT
  labor_cost: number;
  evening_weekend_uplift: number;
  drive_out: number;
  heavy_items: Array<{
    item: string;
    price: number;
  }>;
}

export interface QuoteResult {
  move_total: number;
  move_breakdown: QuoteBreakdown;
  assumptions: string[];
  requires_home_visit: boolean;
  input_summary: QuoteInput;
  calculated_at: string; // ISO timestamp
}

// ============= Constants =============

// Hourly rates after RUT
const HOURLY_RATES: Record<number, number> = {
  2: 595,
  3: 845,
  4: 1095,
};

// Drive-out fee (non-RUT)
const DRIVE_OUT_FEE = 500;

// Heavy item fees (non-RUT)
const HEAVY_ITEM_FEES: Record<string, { name: string; price: number }> = {
  piano: { name: 'Piano', price: 1995 },
  flygel: { name: 'Flygel', price: 3995 },
  safe150: { name: 'Kassaskåp >150 kg', price: 2995 },
};

// Baseline hours based on area (m²)
const BASELINE_CONFIG: Array<{ maxArea: number; team: number; hours: number }> = [
  { maxArea: 35, team: 2, hours: 5.0 },
  { maxArea: 50, team: 2, hours: 6.0 },
  { maxArea: 65, team: 3, hours: 7.0 },
  { maxArea: 80, team: 3, hours: 8.0 },
  { maxArea: 100, team: 4, hours: 9.0 },
  { maxArea: 120, team: 4, hours: 10.5 },
];

// Room to area mapping (m²)
const ROOM_TO_AREA: Record<number, number> = {
  1: 30,
  2: 50,
  3: 75,
  4: 100,
};

// Villa default area
const VILLA_DEFAULT_AREA = 150;

// Minimum charge hours
const MIN_HOURS = 3;

// Default carry distance included (meters)
const INCLUDED_CARRY_M = 35;

// Swedish public holidays 2024-2025 (expandable)
const SWEDISH_HOLIDAYS = [
  '2024-01-01', '2024-01-06', '2024-03-29', '2024-03-31', '2024-04-01',
  '2024-05-01', '2024-05-09', '2024-05-19', '2024-06-06', '2024-06-21',
  '2024-06-22', '2024-11-02', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-31',
  '2025-01-01', '2025-01-06', '2025-04-18', '2025-04-20', '2025-04-21',
  '2025-05-01', '2025-05-29', '2025-06-06', '2025-06-08', '2025-06-20',
  '2025-06-21', '2025-11-01', '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-31',
];

// ============= Helper Functions =============

function roundToHalfHour(hours: number): number {
  return Math.round(hours * 2) / 2;
}

function roundToWholeKr(amount: number): number {
  return Math.round(amount);
}

function isEvening(startTime?: string): boolean {
  if (!startTime) return false;
  const hour = parseInt(startTime.split(':')[0], 10);
  return hour >= 18 || hour < 7;
}

function isWeekend(date?: string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

function isHoliday(date?: string): boolean {
  if (!date) return false;
  return SWEDISH_HOLIDAYS.includes(date);
}

function getAreaFromInput(input: QuoteInput): { area: number; assumptions: string[] } {
  const assumptions: string[] = [];
  
  if (input.area_m2 && input.area_m2 > 0) {
    return { area: input.area_m2, assumptions };
  }
  
  if (input.rooms && input.rooms > 0) {
    const mappedArea = ROOM_TO_AREA[input.rooms] || input.rooms * 25;
    assumptions.push(`Yta uppskattad från ${input.rooms} rum: ${mappedArea} m²`);
    return { area: mappedArea, assumptions };
  }
  
  if (input.dwelling_type === 'villa') {
    assumptions.push(`Villa utan angiven yta: uppskattat ${VILLA_DEFAULT_AREA} m²`);
    return { area: VILLA_DEFAULT_AREA, assumptions };
  }
  
  // Default fallback
  assumptions.push('Ingen yta angiven: uppskattat 50 m²');
  return { area: 50, assumptions };
}

function getBaseline(area: number): { team: number; hours: number; needsHomeVisit: boolean } {
  for (const config of BASELINE_CONFIG) {
    if (area <= config.maxArea) {
      return { team: config.team, hours: config.hours, needsHomeVisit: false };
    }
  }
  
  // For areas > 120 m², extrapolate but recommend home visit
  const extraHours = Math.ceil((area - 120) / 20) * 1.5;
  return { 
    team: 4, 
    hours: 10.5 + extraHours, 
    needsHomeVisit: true 
  };
}

// ============= Main Calculator =============

export function calcQuote(input: QuoteInput): QuoteResult {
  const assumptions: string[] = [];
  
  // 1. Determine area
  const { area, assumptions: areaAssumptions } = getAreaFromInput(input);
  assumptions.push(...areaAssumptions);
  
  // 2. Get baseline (team + hours)
  const baseline = getBaseline(area);
  let laborHours = baseline.hours;
  const team = baseline.team;
  
  if (baseline.needsHomeVisit) {
    assumptions.push('Större yta (>120 m²): Rekommenderar hembesök för validering');
  }
  
  // 3. Stairs adjustment
  let stairsFrom = input.stairs_from;
  let stairsTo = input.stairs_to;
  
  if (stairsFrom === undefined && stairsTo === undefined) {
    // Missing data: assume 0 floors from, 2 floors to
    stairsFrom = 0;
    stairsTo = 2;
    assumptions.push('Våningar ej angivna: antar 0 vån från, 2 vån till (+1.0 h)');
  }
  
  const stairsFromHours = (stairsFrom || 0) * 0.5;
  const stairsToHours = (stairsTo || 0) * 0.5;
  laborHours += stairsFromHours + stairsToHours;
  
  if (stairsFromHours > 0 || stairsToHours > 0) {
    if (!assumptions.some(a => a.includes('Våningar'))) {
      assumptions.push(`Trappor: ${stairsFrom || 0} vån från + ${stairsTo || 0} vån till (+${stairsFromHours + stairsToHours} h)`);
    }
  }
  
  // 4. Carry distance adjustment
  let carryFrom = input.carry_from_m;
  let carryTo = input.carry_to_m;
  
  if (carryFrom === undefined && carryTo === undefined) {
    // Missing data: assume 35m each (included)
    carryFrom = 35;
    carryTo = 35;
    assumptions.push('Bärväg ej angiven: antar 35 m vardera (ingår)');
  }
  
  // Calculate extra carry beyond included 35m
  const extraCarryFrom = Math.max(0, (carryFrom || 0) - INCLUDED_CARRY_M);
  const extraCarryTo = Math.max(0, (carryTo || 0) - INCLUDED_CARRY_M);
  
  // +0.5h per started 20m extra
  const carryFromHours = Math.ceil(extraCarryFrom / 20) * 0.5;
  const carryToHours = Math.ceil(extraCarryTo / 20) * 0.5;
  laborHours += carryFromHours + carryToHours;
  
  if (carryFromHours > 0 || carryToHours > 0) {
    assumptions.push(`Extra bärväg: +${carryFromHours + carryToHours} h`);
  }
  
  // 5. Parking restrictions
  if (input.parking_restrictions) {
    laborHours += 0.5;
    assumptions.push('Svår parkering: +0.5 h');
  }
  
  // 6. Packing/Assembly hours (RUT labor)
  const packingHours = input.packing_hours || 0;
  const assemblyHours = input.assembly_hours || 0;
  laborHours += packingHours + assemblyHours;
  
  if (packingHours > 0) {
    assumptions.push(`Packning: +${packingHours} h`);
  }
  if (assemblyHours > 0) {
    assumptions.push(`Montering: +${assemblyHours} h`);
  }
  
  // 7. Round labor hours to 0.5h, ensure minimum 3h
  laborHours = roundToHalfHour(laborHours);
  laborHours = Math.max(laborHours, MIN_HOURS);
  
  // 8. Calculate labor cost
  const hourlyRate = HOURLY_RATES[team] || HOURLY_RATES[2];
  let laborCost = laborHours * hourlyRate;
  
  // 9. Evening/weekend/holiday uplift (+20% on labor only)
  let eveningWeekendUplift = 0;
  
  if (input.date && input.start_time) {
    const isEveningTime = isEvening(input.start_time);
    const isWeekendDay = isWeekend(input.date);
    const isHolidayDay = isHoliday(input.date);
    
    if (isEveningTime || isWeekendDay || isHolidayDay) {
      eveningWeekendUplift = laborCost * 0.20;
      laborCost += eveningWeekendUplift;
      
      const reasons: string[] = [];
      if (isEveningTime) reasons.push('kväll');
      if (isWeekendDay) reasons.push('helg');
      if (isHolidayDay) reasons.push('helgdag');
      
      assumptions.push(`${reasons.join('/')} tillägg: +20% på arbetskostnad (+${roundToWholeKr(eveningWeekendUplift)} kr)`);
    }
  } else if (!input.start_time && input.date) {
    assumptions.push('Starttid ej angiven: inget kvällstillägg applicerat');
  }
  
  // 10. Heavy items (non-RUT add-ons)
  const heavyItemsBreakdown: Array<{ item: string; price: number }> = [];
  let heavyItemsTotal = 0;
  
  if (input.heavy_items && input.heavy_items.length > 0) {
    for (const item of input.heavy_items) {
      const itemInfo = HEAVY_ITEM_FEES[item];
      if (itemInfo) {
        heavyItemsBreakdown.push({ item: itemInfo.name, price: itemInfo.price });
        heavyItemsTotal += itemInfo.price;
      }
    }
    if (heavyItemsBreakdown.length > 0) {
      assumptions.push(`Tunga föremål: ${heavyItemsBreakdown.map(h => h.item).join(', ')}`);
    }
  }
  
  // 11. Calculate total
  const moveTotal = roundToWholeKr(laborCost + DRIVE_OUT_FEE + heavyItemsTotal);
  
  // 12. Build result
  const result: QuoteResult = {
    move_total: moveTotal,
    move_breakdown: {
      team,
      labor_hours: laborHours,
      hourly: hourlyRate,
      labor_cost: roundToWholeKr(laborCost),
      evening_weekend_uplift: roundToWholeKr(eveningWeekendUplift),
      drive_out: DRIVE_OUT_FEE,
      heavy_items: heavyItemsBreakdown,
    },
    assumptions,
    requires_home_visit: baseline.needsHomeVisit || area > 120,
    input_summary: input,
    calculated_at: new Date().toISOString(),
  };
  
  return result;
}

// ============= Format Output for UI =============

export function formatQuoteForUI(result: QuoteResult): string {
  const { move_total, move_breakdown, assumptions } = result;
  const { team, labor_hours, hourly, labor_cost, drive_out, heavy_items } = move_breakdown;
  
  let output = `FASTPRIS FLYTT: ${move_total.toLocaleString('sv-SE')} kr\n`;
  output += `– Arbete ${team} personer × ${labor_hours} h à ${hourly} kr = ${labor_cost.toLocaleString('sv-SE')} kr\n`;
  output += `– Framkörning = ${drive_out} kr\n`;
  
  if (heavy_items.length > 0) {
    for (const item of heavy_items) {
      output += `– ${item.item} = ${item.price.toLocaleString('sv-SE')} kr\n`;
    }
  }
  
  output += `= Totalt: ${move_total.toLocaleString('sv-SE')} kr\n\n`;
  output += `Så har vi räknat:\n`;
  
  for (const assumption of assumptions) {
    output += `• ${assumption}\n`;
  }
  
  return output;
}
