# NEMW-N328-FinalProject

[Link to Visualization](https://coerciveaxe26.github.io/NEMW-N328-FinalProject/) /
[Link to Video Visualization Tour](https://www.youtube.com/watch?v=Gd6J0xyc48I)

## Documentation: QQQ Market Trends Analysis
Project Overview: I wanted to design an interactive financial visualization designed to explore the five-year historical price action of the Invesco QQQ Trust (2021–2026), contextualized with volume and major global events. QQQ is an exchange traded ETF that tracks the performance of the Nasdaq-100, which has out-performed the S&P 500 seven out of the last ten years.
### 1. Design Process
#### Phase 1: Data Acquisition & Wrangling
The process began with the challenge of sourcing "clean" financial data. Initial attempts included using APIs like yfinance, Nasdaq Data Link, and Alpha Vantage, which were ultimately discarded due to aggressive rate-limiting.
	The Solution: A manual export from Google Finance ultimately was used to bridge the gap, which then required a custom Python pre-processing script to calculate DayOfWeek and Month fields. I ran into numerous issues at this step. I ended up having to manipulate the date format multiple times before the data was in a format that was clean enough to feed my visual.
#### Phase 2: Iterative Prototyping
Initial Design: The first iteration was a simple, static line chart. It was technically functional but failed to provide context.
Failed Attempts: I initially attempted a single-axis view where volume was overlaid on top of the price. This created a crowded visual where the volume bars obscured the price trend.
Final Design: I moved to a dual-axis, dedicating the bottom 20% of the chart to volume. This maintained the focus on price while allowing for conviction analysis.
#### Phase 3: Sketches & Wireframing
Early conceptualizing focused on the "Dashboard" hierarchy. The goal was to ensure that the statistical conclusion (Percent Change) was visible immediately above the supporting evidence (the chart).
### 2. Rationale of Design Choices
#### Encoding & Visual Mapping
##### The Line Chart (Time & Price): A line chart was chosen over a candlestick chart to emphasize the long-term "flow" and trend of the 5-year data, making it easier for non-traders to read.
##### Color for Conviction (Red/Green Bars): Volume bars are color-encoded based on the daily price change (〖Close〗_n≥〖Close〗_(n-1))
Green: Indicates "Buying Conviction" (Price up on high volume).
Red: Indicates "Selling Pressure" (Price down on high volume).
Orange Event Markers: I used a high-contrast orange for historical annotations. This acts as a "visual hook," signaling to the user that there is a narrative layer beneath the numbers.
#### Spatial Arrangement
The Dashboard Header: Placed at the top left to provide an immediate summary. This follows the F-pattern of reading, where users look for the most important "results" first.
Dual-Dropdown Filters: Placing Month and Year side-by-side encourages "Drill-Down" analysis. It allows users to isolate specific regimes (e.g., "The Bear Market of 2022") vs. seasonal trends.
###3. Findings & Discovery
#### Question 1: How did the market react to the peak of the 2021 inflation pivot?
##### Discovery: By filtering for Year: 2021 and All Months, the visualization reveals that while the price peaked in November, volume remained relatively steady, suggesting a "quiet" exit by investors rather than a panic.
##### Evidence: The Dashboard displays a sharp percentage drop beginning late November, marked by the first orange annotation.
#### Question 2: Was the 2023 "AI Boom" supported by high trading conviction?
##### Discovery: By filtering for Year: 2023 and Month: May, we can see a significant price vertical.
##### Evidence: The volume bars during this period (May 24th Nvidia Earnings) are significantly taller than the preceding weeks. This proves that the AI rally was not just a price fluctuation but was supported by massive institutional buying.
#### Question 3: How does the "Geopolitical Shock" of 2026 compare to previous dips?
##### Discovery: Using the Reset View button to see the full 5 years, we can visually compare the 2026 dip to the 2022 bear market.
##### Evidence: While the 2026 dip (marked by the final orange dot) appears sharp, the "Change %" in the dashboard shows the market recovered faster than the 2022 dip, indicating a more resilient market environment in the current era.

