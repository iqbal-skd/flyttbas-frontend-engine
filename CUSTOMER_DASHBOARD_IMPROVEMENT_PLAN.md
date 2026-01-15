# Customer Dashboard UI/UX Improvement Plan

## Current State Analysis

The customer dashboard ("Mina Förfrågningar") currently displays:
- A list of quote requests (left sidebar)
- Selected quote with associated offers (right panel)
- Basic partner info: company name, rating, review count
- Price after RUT deduction

### Issues Identified:
1. **Minimal visual hierarchy** - Cards look plain and don't guide the eye
2. **Missing data from database** - Many useful fields not displayed
3. **No job progress tracking** - Customers can't see job status after approval
4. **Limited partner trust signals** - Only shows rating, missing credentials
5. **No distance/drive time info** - Available in DB but not shown
6. **Basic status badges** - Could be more informative with progress indicators
7. **Underutilized space** - Right panel could show more details
8. **No reviews shown** - Individual reviews exist but aren't displayed

---

## Database Fields Available (Not Currently Shown)

### From `partners` table:
- `completed_jobs` - Number of completed moves
- `is_sponsored` - Highlighted partner status
- `f_tax_certificate` - F-tax registered (trust signal)
- `insurance_company` / `insurance_valid_until` - Insurance status
- `traffic_license_number` - Licensed transport company

### From `offers` table:
- `distance_km` - Distance to job location
- `drive_time_minutes` - Estimated drive time
- `job_status` - Current job status (confirmed/scheduled/in_progress/completed)
- `job_status_updated_at` - When status last changed
- `job_notes` - Partner notes to customer
- `terms` - Offer terms/conditions

### From `quote_requests` table:
- `move_start_time` - Requested start time
- `rooms` - Number of rooms
- `stairs_from` / `stairs_to` - Floor access info
- `elevator_from_size` / `elevator_to_size` - Elevator availability
- `heavy_items` - Special items requiring attention
- `packing_hours` / `assembly_hours` - Additional services requested
- `parking_restrictions` - Parking issues noted

### From `reviews` table:
- `rating` - Individual review ratings
- `comment` - Customer feedback text

---

## Improvement Plan

### 1. Quote List (Left Panel) - Complete Redesign

**Current:** Plain cards with date, address, status badge

**Proposed Changes:**
- Add colored status header banner (like partner dashboard)
- Show countdown/days until move date
- Display number of offers received
- Add visual route indicator (A→B dots)
- Show quick stats: area, rooms, distance if calculated
- Highlight cards with pending offers to review
- Add "New offers!" badge when offers arrive

**Visual Example:**
```
┌─────────────────────────────────┐
│ 📅 söndag 25 januari      [🟡 Väntande]
├─────────────────────────────────┤
│ ○ Malmögatan, Helsingborg       │
│ │                               │
│ ○ Nymärstagatan, Märsta         │
│                                 │
│ villa • 100 m² • 4 rum          │
│ ─────────────────────────       │
│ 🎫 2 offerter    ⏱️ 12 dagar kvar│
└─────────────────────────────────┘
```

---

### 2. Quote Detail Header - Enhanced Information

**Current:** Simple title with addresses

**Proposed Changes:**
- Large move date with countdown badge
- Full address display with clickable Google Maps links
- Property overview card (area, rooms, dwelling type)
- Show requested services (packing, assembly, home visit)
- Display special notes (heavy items, parking issues, stairs)
- Add "Edit request" option if no offers approved yet

**Visual Example:**
```
┌─────────────────────────────────────────────────────────┐
│ Flytt söndag 25 januari 2026           [12 dagar kvar] │
│                                                         │
│ ○ Malmögatan, Helsingborg, 25222    [📍 Visa i karta]  │
│ │  └ Våning 2, Ingen hiss                              │
│ │                                                       │
│ ○ Nymärstagatan, Märsta, 19533      [📍 Visa i karta]  │
│    └ Markplan, Hiss finns                              │
│                                                         │
│ ┌─────────┬─────────┬─────────┬─────────┐              │
│ │  villa  │ 100 m²  │ 4 rum   │ ~45 km  │              │
│ └─────────┴─────────┴─────────┴─────────┘              │
│                                                         │
│ ✓ Packning önskas  ✓ Montering önskas                  │
│ ⚠️ Piano ska flyttas                                   │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Offers Section - Major Enhancement

**Current:** Basic cards with price, time, team size

**Proposed Changes:**

#### A. Offer Card Redesign:
- Larger partner avatar/logo area
- Show completed jobs count
- Display distance from partner to job
- Show "Sponsored" badge if applicable
- Add verification badges (F-tax, Licensed, Insured)
- Display offer terms if provided
- Show individual reviews (1-2 recent)

**Visual Example:**
```
┌─────────────────────────────────────────────────────────┐
│ [⭐ Sponsrad partner]                                   │
├─────────────────────────────────────────────────────────┤
│ 🚚 Flyttfirma Stockholm AB                              │
│ ★ 4.8 (127 omdömen) • 342 genomförda jobb             │
│ ┌──────┬──────┬──────┐  ✓ F-skatt  ✓ Försäkrad        │
│ │ 15km │ 08-12│ 4tim │  ✓ Trafiktillstånd             │
│ │avst. │ tid  │uppsk.│                                 │
│ └──────┴──────┴──────┘                                 │
│                                                         │
│ 💬 "Inkluderar emballage och städning efteråt"         │
│                                                         │
│ 📝 Senaste omdöme:                                     │
│ "Mycket proffsiga och snabba!" - Anna, jan 2026        │
│                                                         │
│ ┌─────────────────┐  ┌─────────────────────┐          │
│ │   8 500 kr      │  │  [Godkänn offert]   │          │
│ │  efter RUT      │  └─────────────────────┘          │
│ │ (17 000 kr före)│                                   │
│ └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

#### B. Add Comparison View:
- Side-by-side comparison of 2-3 offers
- Highlight best value, fastest, highest rated
- Quick comparison table of key metrics

---

### 4. Job Progress Tracking (NEW SECTION)

**For approved offers, show job status:**

**Proposed Changes:**
- Add progress timeline visualization
- Show current status with timestamp
- Display partner notes/messages
- Contact buttons (call, email, SMS)
- Countdown to move date
- Checklist of what to prepare

**Visual Example:**
```
┌─────────────────────────────────────────────────────────┐
│ 📦 DITT JOBB HOS Flyttfirma Stockholm AB               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✓ Bekräftad ─── ○ Schemalagd ─── ○ Pågår ─── ○ Klar   │
│     ↑                                                   │
│  Uppdaterad: 14 jan 2026, 09:30                        │
│                                                         │
│ 💬 Meddelande från flyttfirman:                        │
│ "Vi kommer kl 08:00. Ring om något ändras!"            │
│                                                         │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ 📞 Ring nu      │  │ 📧 Skicka mejl  │               │
│ │ 070-123 45 67   │  │                 │               │
│ └─────────────────┘  └─────────────────┘               │
│                                                         │
│ ⏱️ Flyttdagen om 11 dagar                              │
│                                                         │
│ 📋 Förbered dig:                                        │
│ □ Packa personliga saker                               │
│ □ Märk kartonger med rum                               │
│ □ Töm kylskåp och frys                                 │
│ □ Ordna parkering för flyttbil                         │
└─────────────────────────────────────────────────────────┘
```

---

### 5. Trust Signals & Partner Credentials

**Add footer section with:**
- Verification badges explanation
- "How we verify partners" link
- Customer support contact
- FAQ quick links

**Visual Example:**
```
┌─────────────────────────────────────────────────────────┐
│ ✓ Alla partners är verifierade                         │
│                                                         │
│ [F-skatt ikon] F-skattsedel kontrollerad               │
│ [Försäkring ikon] Ansvarsförsäkring verifierad         │
│ [Licens ikon] Trafiktillstånd för godstransport        │
│ [Stjärna ikon] Omdömen från riktiga kunder             │
│                                                         │
│ Frågor? Kontakta oss: support@flyttbas.se              │
└─────────────────────────────────────────────────────────┘
```

---

### 6. Responsive Design Improvements

**Mobile (< 768px):**
- Stack layout (quotes list above, detail below)
- Collapsible quote list
- Bottom sheet for offer details
- Sticky "Godkänn offert" button

**Tablet (768px - 1024px):**
- 40/60 split layout
- Swipeable offer cards

**Desktop (> 1024px):**
- 30/70 split layout
- Multi-offer comparison view
- Expanded partner details

---

## Implementation Priority

### Phase 1: Quick Wins (High Impact, Low Effort)
1. Add `completed_jobs` and `is_sponsored` to offer cards
2. Add `distance_km` display
3. Add `terms` display
4. Improve status badges with colors/icons
5. Add countdown to move date

### Phase 2: Core Improvements
1. Redesign quote list cards with visual hierarchy
2. Enhance quote detail header with full info
3. Add partner verification badges
4. Display individual reviews
5. Make addresses clickable (Google Maps)

### Phase 3: Major Features
1. Job progress tracking section
2. Partner notes/messages display
3. Comparison view for offers
4. Preparation checklist
5. Mobile-optimized bottom sheet

---

## Database Query Changes Needed

### Current offers query:
```javascript
.select('*, partners(company_name, contact_name, contact_email, contact_phone, average_rating, total_reviews)')
```

### Enhanced query:
```javascript
.select(`
  *,
  partners(
    company_name,
    contact_name,
    contact_email,
    contact_phone,
    average_rating,
    total_reviews,
    completed_jobs,
    is_sponsored,
    f_tax_certificate
  )
`)
```

### Add reviews query (new):
```javascript
const { data: reviews } = await supabase
  .from('reviews')
  .select('rating, comment, created_at')
  .eq('partner_id', partnerId)
  .order('created_at', { ascending: false })
  .limit(2);
```

---

## Files to Modify

1. `src/pages/CustomerDashboard.tsx` - Main dashboard page
2. `src/components/dashboard/QuoteCard.tsx` - Quote list item
3. `src/components/dashboard/OfferCard.tsx` - Offer display
4. `src/components/dashboard/StatusBadge.tsx` - Status indicators
5. NEW: `src/components/dashboard/JobProgressCard.tsx` - Progress tracking
6. NEW: `src/components/dashboard/PartnerBadges.tsx` - Trust badges
7. NEW: `src/components/dashboard/ReviewSnippet.tsx` - Review display

---

## Summary

This plan transforms the customer dashboard from a basic listing into a comprehensive job management interface that:
- Builds trust through visible partner credentials
- Provides transparency with job progress tracking
- Enables informed decisions with detailed offer comparisons
- Reduces anxiety with clear communication and preparation guides
- Improves mobile experience for on-the-go management

The changes leverage existing database fields that are already collected but not displayed, maximizing value without requiring backend changes.
