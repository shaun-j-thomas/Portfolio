# Withdrawn Round 1 Content Archive: Supercar Rear Spoiler 2D CFD Study

> **STATUS:** WITHDRAWN / ARCHIVED (Round 1)  
> **NOTE:** Setup used a stationary ground and a domain that blocked a large fraction of the flow. Do not republish these numbers.

---

## 1. Executive Summary & Problem Statement
- **Freestream Airspeed:** 80.0 m/s (~288 km/h)
- **Baseline Geometry Lift:** -1,415.69 N (Upward aerodynamic lift over roofline)
- **Baseline Drag:** 565.47 N
- **190 deg Spoiler:** +550.42 N vertical force, 674.95 N drag (+109.48 N, +19.4%), net vertical shift +1,966.11 N, L/D = 0.82
- **175 deg Spoiler:** +3,444.84 N vertical force, 890.87 N drag (+325.40 N, +57.5%), net vertical shift +4,860.53 N, L/D = 3.87
- **150 deg Spoiler:** +8,587.88 N vertical force, 1,424.80 N drag (+859.33 N, +152.0%), net vertical shift +10,003.57 N, L/D = 6.03

---

## 2. Methodology & Numerical Setup (Round 1)
- **Solver:** 2D steady-state RANS (ANSYS Fluent 2025 R1)
- **Turbulence Model:** Realizable k-epsilon with Enhanced Wall Treatment (y+ approx 1.0)
- **Working Fluid:** Air (Ideal gas / standard atmospheric properties)
- **Boundary Conditions:** Velocity inlet at 80 m/s, pressure outlet at 0 Pa gauge, stationary wall with no-slip condition on road boundary.

---

## 3. Numerical Summary Table

| Configuration | Angle (deg) | Drag F_D (N) | Vertical F_L (N) | Delta Drag (N) | Delta Drag (%) | Delta Downforce (N) | L/D Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Baseline (Model 1) | None | 565.47 | -1,415.69 | 0.00 | 0.0% | 0.00 | -2.50 |
| 190 deg Spoiler | 190 | 674.95 | +550.42 | +109.48 | +19.4% | +1,966.11 | 0.82 |
| 175 deg Spoiler | 175 | 890.87 | +3,444.84 | +325.40 | +57.5% | +4,860.53 | 3.87 |
| 150 deg Spoiler | 150 | 1,424.80 | +8,587.88 | +859.33 | +152.0% | +10,003.57 | 6.03 |

---

## 4. Marginal Returns Analysis
- **Baseline to 190 deg:** Delta Downforce / Delta Drag = 17.96 N/N (Delta vertical: +1,966.11 N, Delta drag: +109.48 N)
- **190 deg to 175 deg:** Delta Downforce / Delta Drag = 13.41 N/N (Delta vertical: +2,894.42 N, Delta drag: +215.92 N, 193.0 N/deg downforce, 14.4 N/deg drag)
- **175 deg to 150 deg:** Delta Downforce / Delta Drag = 9.63 N/N (Delta vertical: +5,143.04 N, Delta drag: +533.93 N, 205.7 N/deg downforce, 21.4 N/deg drag)
