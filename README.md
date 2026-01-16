# AgriMastery Global Platform (v1.0.0-GOLD)
**Owner:** okoth-hash  
**Architecture:** 7-Layer N-Tier Enterprise Stack

##  Overview
AgriMastery is a secure, scalable ecosystem designed to empower farmers through education and a trusted marketplace. It uses a "Verified First" reputation engine to link Academy success to Marketplace visibility.

##  The 7-Layer Architecture
1. **Presentation (Web/Mobile):** Optimized UIs for farmers and admins.
2. **API Gateway:** Secure entry point with Brute-Force protection.
3. **Business Logic:** The "Brain" (Graduation Engine, Search Ranking).
4. **Service Layer:** Notification Hub (SMS/Email) and Escrow Payments.
5. **Data Access:** State tracking (so farmers never lose progress).
6. **Persistence (Vault):** Secure storage for Genesis Records and User Data.
7. **Infrastructure:** Auto-deployers and system health checkers.

##  Credentials (Demo)
- **Admin/Farmer:** omondi
- **Password:** 1234
- **Security:** Account locks after 3 failed attempts.

##  How to Run
- **Deploy:** ./layers/7_Infrastructure/deploy-system.ps1
- **Login:** ./layers/2_API_Gateway/login-test.ps1
- **Analytics:** ./layers/5_Data_Access/executive-report.ps1

---
*Built for the future of Agricultural Technology.*
