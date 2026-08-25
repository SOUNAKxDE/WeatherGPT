/* =========================================================
   WEATHERGPT — APPLICATION LOGIC (frontend-only prototype)
   ========================================================= */
(function(){
"use strict";

/* =========================================================
   I18N — language data + apply/translate engine
   ========================================================= */
const I18N_DATA = {"langs": [{"code": "en", "native": "English", "english": "English"}, {"code": "hi", "native": "हिन्दी", "english": "Hindi"}, {"code": "bn", "native": "বাংলা", "english": "Bengali"}, {"code": "mr", "native": "मराठी", "english": "Marathi"}, {"code": "te", "native": "తెలుగు", "english": "Telugu"}, {"code": "ta", "native": "தமிழ்", "english": "Tamil"}, {"code": "gu", "native": "ગુજરાતી", "english": "Gujarati"}, {"code": "kn", "native": "ಕನ್ನಡ", "english": "Kannada"}, {"code": "ml", "native": "മലയാളം", "english": "Malayalam"}, {"code": "pa", "native": "ਪੰਜਾਬੀ", "english": "Punjabi"}, {"code": "or", "native": "ଓଡ଼ିଆ", "english": "Odia"}, {"code": "as", "native": "অসমীয়া", "english": "Assamese"}, {"code": "ur", "native": "اردو", "english": "Urdu"}], "dict": {"en": {"nav_platform": "Platform", "nav_intelligence": "Intelligence", "nav_personas": "Who it's for", "nav_login": "Log in", "nav_start": "Get started", "hero_eyebrow": "Predict · Prepare · Protect · Respond", "hero_title_1": "The weather has a lot to say.", "hero_title_2": "WeatherGPT tells you what it means for you.", "hero_sub": "One conversational intelligence layer over radar, satellite, lightning, hydrology and emergency data — turning raw atmosphere into plain-language decisions for citizens, farmers, travelers, researchers and disaster command centres.", "hero_cta_start": "Start with WeatherGPT", "hero_cta_demo": "See it answer a question ↓", "hero_trust_1": "Intelligence pillars", "hero_trust_2": "User personas", "hero_trust_3": "Mesh-resilient SOS", "demo_question": "“Should I carry an umbrella when I leave at 6?”", "demo_answer": "Rain probability climbs to 68% after 5:40 PM near you — pack it, and leave 10 minutes earlier to beat the heaviest band.", "pillars_title": "Four inseparable pillars", "pillars_sub": "Every feature in WeatherGPT lives inside one of these — from a citizen's umbrella question to a command centre's rescue route.", "pillar_weather_title": "Weather Intelligence", "pillar_predictive_title": "Predictive Intelligence", "pillar_impact_title": "Impact Intelligence", "pillar_response_title": "Response Intelligence", "features_title": "Built for how you actually decide things", "features_sub": "Not another weather app — a decision layer.", "personas_title": "Built for everyone who lives under the sky", "footer_tagline": "WeatherGPT — AI-native weather and disaster intelligence.", "auth_side_title": "One account. Every kind of weather decision.", "auth_side_desc": "Sign in once to unlock personalized forecasts, alerts tuned to your role, and emergency tools that work even when networks don't.", "auth_point_1": "Your emergency data is encrypted and access-controlled", "auth_point_2": "Location used only to personalize your forecast", "auth_point_3": "Available in English and regional languages", "auth_welcome_title": "Welcome back", "auth_welcome_sub": "Sign in to continue to WeatherGPT", "tab_phone": "Phone", "tab_email": "Email", "btn_send_otp": "Send OTP", "otp_title": "Enter the 6-digit code", "otp_sub": "We sent a code to", "btn_verify_otp": "Verify & continue", "btn_resend": "Resend code", "otp_change_number": "Change number/email", "profile_title": "Set up your profile", "profile_sub": "This helps WeatherGPT personalize what it shows you", "label_name": "Your name", "label_location": "Home location", "label_role": "I am primarily a…", "role_citizen": "Citizen", "role_farmer": "Farmer", "role_traveler": "Traveler", "role_researcher": "Researcher", "role_official": "Official", "btn_finish_profile": "Finish setup", "back_to_landing": "Back", "side_home": "Home", "side_forecast": "Today's Forecast", "side_chat": "Chat", "side_map": "Map & Hazards", "side_alerts": "Alerts", "side_plan": "Plan", "side_climate": "Climate & Research", "side_command": "Command Centre", "side_sos": "Emergency SOS", "side_new_chat": "New chat", "home_today_title": "Today", "home_hourly_title": "Hourly forecast", "home_week_title": "7-day forecast", "home_lifestyle_title": "For you", "home_alerts_preview_title": "Active alerts", "view_all": "View all", "alerts_title": "Alerts", "alerts_sub": "Official warnings, watches and advisories for your area", "tab_all": "All", "tab_warnings": "Warnings", "tab_watches": "Watches", "tab_advisories": "Advisories", "map_title": "Map & Hazards", "layer_radar": "Radar", "layer_lightning": "Lightning", "layer_flood": "Flood risk", "layer_wind": "Wind", "layer_sos": "SOS heatmap", "layer_shelters": "Shelters", "plan_title": "Plan", "plan_sub": "Purpose-built tools for the decisions weather actually affects", "tab_travel": "Travel", "tab_agri": "Agriculture", "tab_fitness": "Fitness", "tab_event": "Event", "tab_marine": "Marine", "climate_title": "Climate & Research", "climate_sub": "Historical trends and anomaly analysis", "label_metric": "Metric", "label_range": "Range", "command_title": "Command Centre", "command_sub": "Live hazard, incident and resource overview", "sos_title": "Emergency SOS", "sos_sub": "Works over mesh networks even with no signal", "sos_button_label": "HOLD FOR SOS", "sos_cancel": "Cancel SOS", "profile_settings_title": "Profile & Settings", "label_full_name": "Full name", "label_home_location": "Home location", "label_role_pref": "Role", "label_language": "Language", "label_units": "Units", "label_theme": "Theme", "label_accessibility": "Accessibility", "label_large_text": "Large text", "label_high_contrast": "High contrast", "label_reduced_motion": "Reduced motion", "label_low_data": "Low-data mode", "label_battery_sos": "Battery-aware SOS", "label_saved_locations": "Saved locations", "btn_add": "Add", "btn_logout": "Log out", "danger_zone_title": "Account", "btn_save": "Save", "btn_cancel": "Cancel", "btn_continue": "Continue", "btn_back": "Back", "lang_gate_title": "Choose your language", "lang_gate_sub": "You can change this anytime from Settings.", "lang_gate_continue": "Continue", "restricted_note": "Available to Researcher and Official accounts", "restricted_note_command": "Available to Official accounts"}, "hi": {"nav_platform": "प्लेटफ़ॉर्म", "nav_intelligence": "इंटेलिजेंस", "nav_personas": "किसके लिए", "nav_login": "लॉग इन करें", "nav_start": "शुरू करें", "hero_eyebrow": "अनुमान · तैयारी · सुरक्षा · प्रतिक्रिया", "hero_title_1": "मौसम आपको बहुत कुछ बता रहा है।", "hero_title_2": "WeatherGPT आपको बताता है कि इसका आपके लिए क्या मतलब है।", "hero_sub": "रडार, उपग्रह, बिजली, जल-विज्ञान और आपातकालीन डेटा पर एक संवादात्मक इंटेलिजेंस परत — कच्चे मौसम डेटा को नागरिकों, किसानों, यात्रियों, शोधकर्ताओं और आपदा कमान केंद्रों के लिए सरल भाषा में निर्णयों में बदलती है।", "hero_cta_start": "WeatherGPT के साथ शुरू करें", "hero_cta_demo": "एक सवाल का जवाब देखें ↓", "hero_trust_1": "इंटेलिजेंस स्तंभ", "hero_trust_2": "उपयोगकर्ता प्रकार", "hero_trust_3": "मेश-रेज़िलिएंट SOS", "demo_question": "“अगर मैं 6 बजे निकलूं तो क्या छाता ले जाऊं?”", "demo_answer": "आपके पास शाम 5:40 बजे के बाद बारिश की संभावना 68% तक बढ़ जाती है — छाता साथ रखें और सबसे भारी बारिश से बचने के लिए 10 मिनट पहले निकलें।", "pillars_title": "चार अभिन्न स्तंभ", "pillars_sub": "WeatherGPT की हर सुविधा इन्हीं में से किसी एक में है — एक नागरिक के छाते के सवाल से लेकर कमान केंद्र के बचाव मार्ग तक।", "pillar_weather_title": "मौसम इंटेलिजेंस", "pillar_predictive_title": "पूर्वानुमान इंटेलिजेंस", "pillar_impact_title": "प्रभाव इंटेलिजेंस", "pillar_response_title": "प्रतिक्रिया इंटेलिजेंस", "features_title": "आपके निर्णय लेने के तरीके के अनुसार बनाया गया", "features_sub": "एक और मौसम ऐप नहीं — एक निर्णय परत।", "personas_title": "आसमान के नीचे रहने वाले हर व्यक्ति के लिए", "footer_tagline": "WeatherGPT — AI-आधारित मौसम और आपदा इंटेलिजेंस।", "auth_side_title": "एक खाता। मौसम से जुड़ा हर फैसला।", "auth_side_desc": "व्यक्तिगत पूर्वानुमान, आपकी भूमिका के अनुसार अलर्ट, और ऐसे आपातकालीन उपकरण अनलॉक करने के लिए एक बार साइन इन करें जो नेटवर्क न होने पर भी काम करते हैं।", "auth_point_1": "आपका आपातकालीन डेटा एन्क्रिप्टेड और सुरक्षित है", "auth_point_2": "स्थान का उपयोग केवल आपके पूर्वानुमान को व्यक्तिगत बनाने के लिए होता है", "auth_point_3": "अंग्रेज़ी और क्षेत्रीय भाषाओं में उपलब्ध", "auth_welcome_title": "वापसी पर स्वागत है", "auth_welcome_sub": "WeatherGPT जारी रखने के लिए साइन इन करें", "tab_phone": "फ़ोन", "tab_email": "ईमेल", "btn_send_otp": "OTP भेजें", "otp_title": "6-अंकीय कोड दर्ज करें", "otp_sub": "हमने यह कोड भेजा है", "btn_verify_otp": "सत्यापित करें और जारी रखें", "btn_resend": "कोड फिर भेजें", "otp_change_number": "नंबर/ईमेल बदलें", "profile_title": "अपनी प्रोफ़ाइल सेट करें", "profile_sub": "इससे WeatherGPT आपको दिखाई जाने वाली जानकारी व्यक्तिगत बना पाता है", "label_name": "आपका नाम", "label_location": "घर का स्थान", "label_role": "मैं मुख्यतः हूँ…", "role_citizen": "नागरिक", "role_farmer": "किसान", "role_traveler": "यात्री", "role_researcher": "शोधकर्ता", "role_official": "अधिकारी", "btn_finish_profile": "सेटअप पूरा करें", "back_to_landing": "वापस", "side_home": "होम", "side_chat": "चैट", "side_map": "मानचित्र और खतरे", "side_alerts": "अलर्ट", "side_plan": "योजना", "side_climate": "जलवायु और शोध", "side_command": "कमान केंद्र", "side_sos": "आपातकालीन SOS", "side_new_chat": "नई चैट", "home_today_title": "आज", "home_hourly_title": "प्रति घंटा पूर्वानुमान", "home_week_title": "7-दिन का पूर्वानुमान", "home_lifestyle_title": "आपके लिए", "home_alerts_preview_title": "सक्रिय अलर्ट", "view_all": "सभी देखें", "alerts_title": "अलर्ट", "alerts_sub": "आपके क्षेत्र के लिए आधिकारिक चेतावनियाँ और सलाह", "tab_all": "सभी", "tab_warnings": "चेतावनी", "tab_watches": "निगरानी", "tab_advisories": "सलाह", "map_title": "मानचित्र और खतरे", "layer_radar": "रडार", "layer_lightning": "बिजली", "layer_flood": "बाढ़ जोखिम", "layer_wind": "हवा", "layer_sos": "SOS हीटमैप", "layer_shelters": "आश्रय", "plan_title": "योजना", "plan_sub": "मौसम से प्रभावित निर्णयों के लिए विशेष उपकरण", "tab_travel": "यात्रा", "tab_agri": "कृषि", "tab_fitness": "फिटनेस", "tab_event": "आयोजन", "tab_marine": "समुद्री", "climate_title": "जलवायु और शोध", "climate_sub": "ऐतिहासिक रुझान और विसंगति विश्लेषण", "label_metric": "मापदंड", "label_range": "अवधि", "command_title": "कमान केंद्र", "command_sub": "लाइव खतरा, घटना और संसाधन अवलोकन", "sos_title": "आपातकालीन SOS", "sos_sub": "नेटवर्क न होने पर भी मेश नेटवर्क पर काम करता है", "sos_button_label": "SOS के लिए दबाए रखें", "sos_cancel": "SOS रद्द करें", "profile_settings_title": "प्रोफ़ाइल और सेटिंग्स", "label_full_name": "पूरा नाम", "label_home_location": "घर का स्थान", "label_role_pref": "भूमिका", "label_language": "भाषा", "label_units": "इकाइयाँ", "label_theme": "थीम", "label_accessibility": "सुगम्यता", "label_large_text": "बड़ा टेक्स्ट", "label_high_contrast": "उच्च कंट्रास्ट", "label_reduced_motion": "कम एनिमेशन", "label_low_data": "लो-डेटा मोड", "label_battery_sos": "बैटरी-अनुकूल SOS", "label_saved_locations": "सहेजे गए स्थान", "btn_add": "जोड़ें", "btn_logout": "लॉग आउट", "danger_zone_title": "खाता", "btn_save": "सहेजें", "btn_cancel": "रद्द करें", "btn_continue": "जारी रखें", "btn_back": "वापस", "lang_gate_title": "अपनी भाषा चुनें", "lang_gate_sub": "आप इसे कभी भी सेटिंग्स से बदल सकते हैं।", "lang_gate_continue": "जारी रखें", "restricted_note": "शोधकर्ता और अधिकारी खातों के लिए उपलब्ध", "restricted_note_command": "अधिकारी खातों के लिए उपलब्ध"}, "bn": {"nav_platform": "প্ল্যাটফর্ম", "nav_intelligence": "ইন্টেলিজেন্স", "nav_personas": "কাদের জন্য", "nav_login": "লগ ইন", "nav_start": "শুরু করুন", "hero_eyebrow": "পূর্বাভাস · প্রস্তুতি · সুরক্ষা · সাড়া", "hero_title_1": "আবহাওয়ার অনেক কিছু বলার আছে।", "hero_title_2": "WeatherGPT আপনাকে বলে দেয় এর মানে আপনার জন্য কী।", "hero_sub": "রাডার, উপগ্রহ, বজ্রপাত, জলবিজ্ঞান ও জরুরি তথ্যের উপর একটি কথোপকথনমূলক ইন্টেলিজেন্স স্তর — যা কাঁচা আবহাওয়া তথ্যকে নাগরিক, কৃষক, ভ্রমণকারী, গবেষক ও দুর্যোগ কমান্ড কেন্দ্রের জন্য সহজ ভাষায় সিদ্ধান্তে রূপান্তরিত করে।", "hero_cta_start": "WeatherGPT দিয়ে শুরু করুন", "hero_cta_demo": "একটি প্রশ্নের উত্তর দেখুন ↓", "hero_trust_1": "ইন্টেলিজেন্স স্তম্ভ", "hero_trust_2": "ব্যবহারকারী প্রোফাইল", "hero_trust_3": "মেশ-রেজিলিয়েন্ট SOS", "demo_question": "“৬টায় বের হলে কি ছাতা নেওয়া উচিত?”", "demo_answer": "সন্ধ্যা ৫:৪০ টার পর বৃষ্টির সম্ভাবনা বেড়ে ৬৮% হয় — ছাতা সঙ্গে রাখুন এবং সবচেয়ে ভারী বৃষ্টি এড়াতে ১০ মিনিট আগে বের হোন।", "pillars_title": "চারটি অবিচ্ছেদ্য স্তম্ভ", "pillars_sub": "WeatherGPT-র প্রতিটি ফিচার এদের মধ্যে একটির মধ্যে থাকে — একজন নাগরিকের ছাতার প্রশ্ন থেকে শুরু করে কমান্ড কেন্দ্রের উদ্ধার পথ পর্যন্ত।", "pillar_weather_title": "আবহাওয়া ইন্টেলিজেন্স", "pillar_predictive_title": "পূর্বাভাস ইন্টেলিজেন্স", "pillar_impact_title": "প্রভাব ইন্টেলিজেন্স", "pillar_response_title": "সাড়া ইন্টেলিজেন্স", "features_title": "আপনি যেভাবে সিদ্ধান্ত নেন সেভাবেই তৈরি", "features_sub": "আরেকটি আবহাওয়া অ্যাপ নয় — একটি সিদ্ধান্ত স্তর।", "personas_title": "আকাশের নিচে বসবাসকারী সবার জন্য তৈরি", "footer_tagline": "WeatherGPT — AI-চালিত আবহাওয়া ও দুর্যোগ ইন্টেলিজেন্স।", "auth_side_title": "একটি অ্যাকাউন্ট। আবহাওয়া সংক্রান্ত প্রতিটি সিদ্ধান্ত।", "auth_side_desc": "ব্যক্তিগত পূর্বাভাস, আপনার ভূমিকা অনুযায়ী অ্যালার্ট এবং নেটওয়ার্ক না থাকলেও কাজ করে এমন জরুরি টুল আনলক করতে একবার সাইন ইন করুন।", "auth_point_1": "আপনার জরুরি তথ্য এনক্রিপ্টেড ও সুরক্ষিত", "auth_point_2": "আপনার অবস্থান শুধু পূর্বাভাস ব্যক্তিগত করতে ব্যবহৃত হয়", "auth_point_3": "ইংরেজি ও আঞ্চলিক ভাষায় উপলব্ধ", "auth_welcome_title": "আবার স্বাগতম", "auth_welcome_sub": "WeatherGPT চালিয়ে যেতে সাইন ইন করুন", "tab_phone": "ফোন", "tab_email": "ইমেইল", "btn_send_otp": "OTP পাঠান", "otp_title": "৬-সংখ্যার কোড লিখুন", "otp_sub": "আমরা কোড পাঠিয়েছি", "btn_verify_otp": "যাচাই করে এগিয়ে যান", "btn_resend": "আবার পাঠান", "otp_change_number": "নম্বর/ইমেইল বদলান", "profile_title": "আপনার প্রোফাইল সেট করুন", "profile_sub": "এটি WeatherGPT-কে আপনার জন্য তথ্য ব্যক্তিগত করতে সাহায্য করে", "label_name": "আপনার নাম", "label_location": "বাড়ির অবস্থান", "label_role": "আমি প্রধানত…", "role_citizen": "নাগরিক", "role_farmer": "কৃষক", "role_traveler": "ভ্রমণকারী", "role_researcher": "গবেষক", "role_official": "কর্মকর্তা", "btn_finish_profile": "সেটআপ শেষ করুন", "back_to_landing": "পেছনে", "side_home": "হোম", "side_chat": "চ্যাট", "side_map": "মানচিত্র ও বিপদ", "side_alerts": "অ্যালার্ট", "side_plan": "পরিকল্পনা", "side_climate": "জলবায়ু ও গবেষণা", "side_command": "কমান্ড কেন্দ্র", "side_sos": "জরুরি SOS", "side_new_chat": "নতুন চ্যাট", "home_today_title": "আজ", "home_hourly_title": "ঘণ্টাভিত্তিক পূর্বাভাস", "home_week_title": "৭-দিনের পূর্বাভাস", "home_lifestyle_title": "আপনার জন্য", "home_alerts_preview_title": "সক্রিয় অ্যালার্ট", "view_all": "সব দেখুন", "alerts_title": "অ্যালার্ট", "alerts_sub": "আপনার এলাকার জন্য সরকারি সতর্কতা ও পরামর্শ", "tab_all": "সব", "tab_warnings": "সতর্কতা", "tab_watches": "পর্যবেক্ষণ", "tab_advisories": "পরামর্শ", "map_title": "মানচিত্র ও বিপদ", "layer_radar": "রাডার", "layer_lightning": "বজ্রপাত", "layer_flood": "বন্যা ঝুঁকি", "layer_wind": "বাতাস", "layer_sos": "SOS হিটম্যাপ", "layer_shelters": "আশ্রয়কেন্দ্র", "plan_title": "পরিকল্পনা", "plan_sub": "আবহাওয়া প্রভাবিত সিদ্ধান্তের জন্য বিশেষ টুল", "tab_travel": "ভ্রমণ", "tab_agri": "কৃষি", "tab_fitness": "ফিটনেস", "tab_event": "অনুষ্ঠান", "tab_marine": "সামুদ্রিক", "climate_title": "জলবায়ু ও গবেষণা", "climate_sub": "ঐতিহাসিক প্রবণতা ও অসঙ্গতি বিশ্লেষণ", "label_metric": "মেট্রিক", "label_range": "সময়কাল", "command_title": "কমান্ড কেন্দ্র", "command_sub": "লাইভ বিপদ, ঘটনা ও সম্পদের সংক্ষিপ্ত বিবরণ", "sos_title": "জরুরি SOS", "sos_sub": "সিগন্যাল না থাকলেও মেশ নেটওয়ার্কে কাজ করে", "sos_button_label": "SOS-এর জন্য চেপে ধরুন", "sos_cancel": "SOS বাতিল করুন", "profile_settings_title": "প্রোফাইল ও সেটিংস", "label_full_name": "পুরো নাম", "label_home_location": "বাড়ির অবস্থান", "label_role_pref": "ভূমিকা", "label_language": "ভাষা", "label_units": "একক", "label_theme": "থিম", "label_accessibility": "অ্যাক্সেসযোগ্যতা", "label_large_text": "বড় লেখা", "label_high_contrast": "উচ্চ কনট্রাস্ট", "label_reduced_motion": "কম অ্যানিমেশন", "label_low_data": "লো-ডেটা মোড", "label_battery_sos": "ব্যাটারি-সচেতন SOS", "label_saved_locations": "সংরক্ষিত অবস্থান", "btn_add": "যোগ করুন", "btn_logout": "লগ আউট", "danger_zone_title": "অ্যাকাউন্ট", "btn_save": "সংরক্ষণ করুন", "btn_cancel": "বাতিল", "btn_continue": "চালিয়ে যান", "btn_back": "পেছনে", "lang_gate_title": "আপনার ভাষা বেছে নিন", "lang_gate_sub": "আপনি যেকোনো সময় সেটিংস থেকে এটি পরিবর্তন করতে পারেন।", "lang_gate_continue": "চালিয়ে যান", "restricted_note": "গবেষক ও কর্মকর্তা অ্যাকাউন্টের জন্য উপলব্ধ", "restricted_note_command": "কর্মকর্তা অ্যাকাউন্টের জন্য উপলব্ধ"}, "mr": {"nav_platform": "प्लॅटफॉर्म", "nav_intelligence": "इंटेलिजन्स", "nav_personas": "कोणासाठी", "nav_login": "लॉग इन करा", "nav_start": "सुरुवात करा", "hero_eyebrow": "अंदाज · तयारी · संरक्षण · प्रतिसाद", "hero_title_1": "हवामान बरंच काही सांगत आहे.", "hero_title_2": "WeatherGPT तुम्हाला सांगते याचा तुमच्यासाठी अर्थ काय आहे.", "hero_sub": "रडार, उपग्रह, वीज, जलविज्ञान आणि आपत्कालीन डेटावर आधारित एक संवादात्मक इंटेलिजन्स स्तर — जो कच्च्या हवामान डेटाला नागरिक, शेतकरी, प्रवासी, संशोधक आणि आपत्ती नियंत्रण केंद्रांसाठी सोप्या भाषेतील निर्णयांमध्ये रूपांतरित करतो.", "hero_cta_start": "WeatherGPT सह सुरुवात करा", "hero_cta_demo": "एका प्रश्नाचे उत्तर पहा ↓", "hero_trust_1": "इंटेलिजन्स स्तंभ", "hero_trust_2": "वापरकर्ता प्रकार", "hero_trust_3": "मेश-रेझिलिएंट SOS", "demo_question": "“मी ६ वाजता निघालो तर छत्री न्यावी का?”", "demo_answer": "संध्याकाळी ५:४० नंतर पावसाची शक्यता ६८% पर्यंत वाढते — छत्री सोबत ठेवा आणि सर्वात जास्त पावसापासून वाचण्यासाठी १० मिनिटे आधी निघा.", "pillars_title": "चार अविभाज्य स्तंभ", "pillars_sub": "WeatherGPT मधील प्रत्येक वैशिष्ट्य यापैकी एका स्तंभात असते — नागरिकाच्या छत्रीच्या प्रश्नापासून कमांड केंद्राच्या बचाव मार्गापर्यंत.", "pillar_weather_title": "हवामान इंटेलिजन्स", "pillar_predictive_title": "अंदाज इंटेलिजन्स", "pillar_impact_title": "परिणाम इंटेलिजन्स", "pillar_response_title": "प्रतिसाद इंटेलिजन्स", "features_title": "तुम्ही निर्णय कसे घेता त्यानुसार तयार केलेले", "features_sub": "आणखी एक हवामान अ‍ॅप नाही — एक निर्णय स्तर.", "personas_title": "आकाशाखाली राहणाऱ्या प्रत्येकासाठी", "footer_tagline": "WeatherGPT — AI-आधारित हवामान आणि आपत्ती इंटेलिजन्स.", "auth_side_title": "एक खाते. हवामानाशी संबंधित प्रत्येक निर्णय.", "auth_side_desc": "वैयक्तिकृत अंदाज, तुमच्या भूमिकेनुसार अलर्ट आणि नेटवर्क नसतानाही काम करणारी आपत्कालीन साधने अनलॉक करण्यासाठी एकदा साइन इन करा.", "auth_point_1": "तुमचा आपत्कालीन डेटा एन्क्रिप्टेड आणि सुरक्षित आहे", "auth_point_2": "स्थान फक्त तुमचा अंदाज वैयक्तिकृत करण्यासाठी वापरले जाते", "auth_point_3": "इंग्रजी आणि प्रादेशिक भाषांमध्ये उपलब्ध", "auth_welcome_title": "पुन्हा स्वागत आहे", "auth_welcome_sub": "WeatherGPT सुरू ठेवण्यासाठी साइन इन करा", "tab_phone": "फोन", "tab_email": "ईमेल", "btn_send_otp": "OTP पाठवा", "otp_title": "६-अंकी कोड टाका", "otp_sub": "आम्ही कोड पाठवला आहे", "btn_verify_otp": "सत्यापित करा आणि पुढे जा", "btn_resend": "पुन्हा पाठवा", "otp_change_number": "नंबर/ईमेल बदला", "profile_title": "तुमची प्रोफाइल सेट करा", "profile_sub": "यामुळे WeatherGPT ला तुम्हाला दाखवली जाणारी माहिती वैयक्तिकृत करता येते", "label_name": "तुमचे नाव", "label_location": "घराचे ठिकाण", "label_role": "मी प्रामुख्याने आहे…", "role_citizen": "नागरिक", "role_farmer": "शेतकरी", "role_traveler": "प्रवासी", "role_researcher": "संशोधक", "role_official": "अधिकारी", "btn_finish_profile": "सेटअप पूर्ण करा", "back_to_landing": "मागे", "side_home": "होम", "side_chat": "चॅट", "side_map": "नकाशा आणि धोके", "side_alerts": "अलर्ट", "side_plan": "योजना", "side_climate": "हवामानशास्त्र आणि संशोधन", "side_command": "कमांड केंद्र", "side_sos": "आपत्कालीन SOS", "side_new_chat": "नवीन चॅट", "home_today_title": "आज", "home_hourly_title": "तासागणिक अंदाज", "home_week_title": "७-दिवसांचा अंदाज", "home_lifestyle_title": "तुमच्यासाठी", "home_alerts_preview_title": "सक्रिय अलर्ट", "view_all": "सर्व पहा", "alerts_title": "अलर्ट", "alerts_sub": "तुमच्या भागासाठी अधिकृत सूचना आणि सल्ला", "tab_all": "सर्व", "tab_warnings": "इशारे", "tab_watches": "निरीक्षण", "tab_advisories": "सल्ला", "map_title": "नकाशा आणि धोके", "layer_radar": "रडार", "layer_lightning": "वीज", "layer_flood": "पूर धोका", "layer_wind": "वारा", "layer_sos": "SOS हीटमॅप", "layer_shelters": "आश्रयस्थान", "plan_title": "योजना", "plan_sub": "हवामानामुळे प्रभावित निर्णयांसाठी खास साधने", "tab_travel": "प्रवास", "tab_agri": "शेती", "tab_fitness": "फिटनेस", "tab_event": "कार्यक्रम", "tab_marine": "सागरी", "climate_title": "हवामानशास्त्र आणि संशोधन", "climate_sub": "ऐतिहासिक कल आणि विसंगती विश्लेषण", "label_metric": "मेट्रिक", "label_range": "कालावधी", "command_title": "कमांड केंद्र", "command_sub": "थेट धोका, घटना आणि संसाधन आढावा", "sos_title": "आपत्कालीन SOS", "sos_sub": "नेटवर्क नसतानाही मेश नेटवर्कवर काम करते", "sos_button_label": "SOS साठी दाबून ठेवा", "sos_cancel": "SOS रद्द करा", "profile_settings_title": "प्रोफाइल आणि सेटिंग्ज", "label_full_name": "पूर्ण नाव", "label_home_location": "घराचे ठिकाण", "label_role_pref": "भूमिका", "label_language": "भाषा", "label_units": "एकके", "label_theme": "थीम", "label_accessibility": "सुलभता", "label_large_text": "मोठा मजकूर", "label_high_contrast": "उच्च कॉन्ट्रास्ट", "label_reduced_motion": "कमी अ‍ॅनिमेशन", "label_low_data": "लो-डेटा मोड", "label_battery_sos": "बॅटरी-जागरूक SOS", "label_saved_locations": "जतन केलेली ठिकाणे", "btn_add": "जोडा", "btn_logout": "लॉग आउट", "danger_zone_title": "खाते", "btn_save": "जतन करा", "btn_cancel": "रद्द करा", "btn_continue": "पुढे जा", "btn_back": "मागे", "lang_gate_title": "तुमची भाषा निवडा", "lang_gate_sub": "तुम्ही ही सेटिंग्जमधून केव्हाही बदलू शकता.", "lang_gate_continue": "पुढे जा", "restricted_note": "संशोधक आणि अधिकारी खात्यांसाठी उपलब्ध", "restricted_note_command": "अधिकारी खात्यांसाठी उपलब्ध"}, "te": {"nav_platform": "ప్లాట్‌ఫారమ్", "nav_intelligence": "ఇంటెలిజెన్స్", "nav_personas": "ఎవరి కోసం", "nav_login": "లాగిన్", "nav_start": "ప్రారంభించండి", "hero_eyebrow": "అంచనా · సన్నద్ధత · రక్షణ · స్పందన", "hero_title_1": "వాతావరణం చాలా చెప్పాలనుకుంటోంది.", "hero_title_2": "అది మీకు ఏమి అర్థమో WeatherGPT చెబుతుంది.", "hero_sub": "రాడార్, ఉపగ్రహం, మెరుపులు, జలవిజ్ఞానం మరియు అత్యవసర డేటాపై ఒక సంభాషణాత్మక ఇంటెలిజెన్స్ పొర — పౌరులు, రైతులు, ప్రయాణికులు, పరిశోధకులు మరియు విపత్తు కమాండ్ కేంద్రాల కోసం ముడి వాతావరణ డేటాను సాధారణ భాషలో నిర్ణయాలుగా మారుస్తుంది.", "hero_cta_start": "WeatherGPTతో ప్రారంభించండి", "hero_cta_demo": "ఒక ప్రశ్నకు సమాధానం చూడండి ↓", "hero_trust_1": "ఇంటెలిజెన్స్ స్తంభాలు", "hero_trust_2": "వినియోగదారు రకాలు", "hero_trust_3": "మెష్-రెసిలియంట్ SOS", "demo_question": "“నేను 6 గంటలకు బయలుదేరితే గొడుగు తీసుకెళ్లాలా?”", "demo_answer": "సాయంత్రం 5:40 తర్వాత వర్షం అవకాశం 68%కి పెరుగుతుంది — గొడుగు తీసుకెళ్లండి, భారీ వర్షాన్ని తప్పించుకోవడానికి 10 నిమిషాలు ముందుగా బయలుదేరండి.", "pillars_title": "నాలుగు విడదీయరాని స్తంభాలు", "pillars_sub": "WeatherGPTలోని ప్రతి ఫీచర్ వీటిలో ఒకదానిలో ఉంటుంది — పౌరుడి గొడుగు ప్రశ్న నుండి కమాండ్ కేంద్రం రెస్క్యూ మార్గం వరకు.", "pillar_weather_title": "వాతావరణ ఇంటెలిజెన్స్", "pillar_predictive_title": "అంచనా ఇంటెలిజెన్స్", "pillar_impact_title": "ప్రభావ ఇంటెలిజెన్స్", "pillar_response_title": "స్పందన ఇంటెలిజెన్స్", "features_title": "మీరు నిర్ణయాలు తీసుకునే విధానానికి అనుగుణంగా రూపొందించబడింది", "features_sub": "మరో వాతావరణ యాప్ కాదు — ఒక నిర్ణయ పొర.", "personas_title": "ఆకాశం కింద జీవించే ప్రతి ఒక్కరి కోసం", "footer_tagline": "WeatherGPT — AI-ఆధారిత వాతావరణం మరియు విపత్తు ఇంటెలిజెన్స్.", "auth_side_title": "ఒక ఖాతా. ప్రతి వాతావరణ నిర్ణయం.", "auth_side_desc": "వ్యక్తిగతీకరించిన అంచనాలు, మీ పాత్రకు అనుగుణంగా అలర్ట్‌లు మరియు నెట్‌వర్క్ లేకపోయినా పనిచేసే అత్యవసర సాధనాలను అన్‌లాక్ చేయడానికి ఒకసారి సైన్ ఇన్ చేయండి.", "auth_point_1": "మీ అత్యవసర డేటా ఎన్‌క్రిప్ట్ చేయబడి, రక్షించబడుతుంది", "auth_point_2": "మీ అంచనాను వ్యక్తిగతీకరించడానికి మాత్రమే స్థానం ఉపయోగించబడుతుంది", "auth_point_3": "ఇంగ్లీష్ మరియు ప్రాంతీయ భాషలలో అందుబాటులో ఉంది", "auth_welcome_title": "తిరిగి స్వాగతం", "auth_welcome_sub": "WeatherGPT కొనసాగించడానికి సైన్ ఇన్ చేయండి", "tab_phone": "ఫోన్", "tab_email": "ఇమెయిల్", "btn_send_otp": "OTP పంపండి", "otp_title": "6-అంకెల కోడ్ నమోదు చేయండి", "otp_sub": "మేము కోడ్ పంపాము", "btn_verify_otp": "ధృవీకరించి కొనసాగించండి", "btn_resend": "మళ్లీ పంపండి", "otp_change_number": "నంబర్/ఇమెయిల్ మార్చండి", "profile_title": "మీ ప్రొఫైల్‌ను సెటప్ చేయండి", "profile_sub": "ఇది WeatherGPTకి మీకు చూపే సమాచారాన్ని వ్యక్తిగతీకరించడంలో సహాయపడుతుంది", "label_name": "మీ పేరు", "label_location": "ఇంటి స్థానం", "label_role": "నేను ప్రధానంగా…", "role_citizen": "పౌరుడు", "role_farmer": "రైతు", "role_traveler": "ప్రయాణికుడు", "role_researcher": "పరిశోధకుడు", "role_official": "అధికారి", "btn_finish_profile": "సెటప్ పూర్తి చేయండి", "back_to_landing": "వెనుకకు", "side_home": "హోమ్", "side_chat": "చాట్", "side_map": "మ్యాప్ & ప్రమాదాలు", "side_alerts": "అలర్ట్‌లు", "side_plan": "ప్లాన్", "side_climate": "వాతావరణ మార్పు & పరిశోధన", "side_command": "కమాండ్ కేంద్రం", "side_sos": "అత్యవసర SOS", "side_new_chat": "కొత్త చాట్", "home_today_title": "ఈరోజు", "home_hourly_title": "గంట వారీ అంచనా", "home_week_title": "7-రోజుల అంచనా", "home_lifestyle_title": "మీ కోసం", "home_alerts_preview_title": "యాక్టివ్ అలర్ట్‌లు", "view_all": "అన్నీ చూడండి", "alerts_title": "అలర్ట్‌లు", "alerts_sub": "మీ ప్రాంతానికి అధికారిక హెచ్చరికలు మరియు సలహాలు", "tab_all": "అన్నీ", "tab_warnings": "హెచ్చరికలు", "tab_watches": "పరిశీలనలు", "tab_advisories": "సలహాలు", "map_title": "మ్యాప్ & ప్రమాదాలు", "layer_radar": "రాడార్", "layer_lightning": "మెరుపులు", "layer_flood": "వరద ప్రమాదం", "layer_wind": "గాలి", "layer_sos": "SOS హీట్‌మ్యాప్", "layer_shelters": "ఆశ్రయాలు", "plan_title": "ప్లాన్", "plan_sub": "వాతావరణం ప్రభావితం చేసే నిర్ణయాల కోసం ప్రత్యేక సాధనాలు", "tab_travel": "ప్రయాణం", "tab_agri": "వ్యవసాయం", "tab_fitness": "ఫిట్‌నెస్", "tab_event": "ఈవెంట్", "tab_marine": "సముద్ర", "climate_title": "వాతావరణ మార్పు & పరిశోధన", "climate_sub": "చారిత్రక ధోరణులు మరియు అసమానతల విశ్లేషణ", "label_metric": "మెట్రిక్", "label_range": "కాలం", "command_title": "కమాండ్ కేంద్రం", "command_sub": "లైవ్ ప్రమాదం, ఘటన మరియు వనరుల అవలోకనం", "sos_title": "అత్యవసర SOS", "sos_sub": "సిగ్నల్ లేకపోయినా మెష్ నెట్‌వర్క్‌లపై పనిచేస్తుంది", "sos_button_label": "SOS కోసం నొక్కి ఉంచండి", "sos_cancel": "SOS రద్దు చేయండి", "profile_settings_title": "ప్రొఫైల్ & సెట్టింగ్‌లు", "label_full_name": "పూర్తి పేరు", "label_home_location": "ఇంటి స్థానం", "label_role_pref": "పాత్ర", "label_language": "భాష", "label_units": "యూనిట్లు", "label_theme": "థీమ్", "label_accessibility": "యాక్సెసిబిలిటీ", "label_large_text": "పెద్ద టెక్స్ట్", "label_high_contrast": "అధిక కాంట్రాస్ట్", "label_reduced_motion": "తక్కువ యానిమేషన్", "label_low_data": "లో-డేటా మోడ్", "label_battery_sos": "బ్యాటరీ-అవగాహన SOS", "label_saved_locations": "సేవ్ చేసిన స్థానాలు", "btn_add": "జోడించండి", "btn_logout": "లాగ్ అవుట్", "danger_zone_title": "ఖాతా", "btn_save": "సేవ్ చేయండి", "btn_cancel": "రద్దు చేయండి", "btn_continue": "కొనసాగించండి", "btn_back": "వెనుకకు", "lang_gate_title": "మీ భాషను ఎంచుకోండి", "lang_gate_sub": "మీరు దీన్ని సెట్టింగ్‌ల నుండి ఎప్పుడైనా మార్చుకోవచ్చు.", "lang_gate_continue": "కొనసాగించండి", "restricted_note": "పరిశోధకులు మరియు అధికారుల ఖాతాలకు అందుబాటులో ఉంది", "restricted_note_command": "అధికారుల ఖాతాలకు అందుబాటులో ఉంది"}, "ta": {"nav_platform": "தளம்", "nav_intelligence": "இன்டெலிஜென்ஸ்", "nav_personas": "யாருக்காக", "nav_login": "உள்நுழைக", "nav_start": "தொடங்குங்கள்", "hero_eyebrow": "கணிப்பு · தயார் · பாதுகாப்பு · பதில்", "hero_title_1": "வானிலை நிறைய சொல்ல வேண்டியிருக்கிறது.", "hero_title_2": "அது உங்களுக்கு என்ன அர்த்தம் என்பதை WeatherGPT சொல்கிறது.", "hero_sub": "ரேடார், செயற்கைக்கோள், மின்னல், நீரியல் மற்றும் அவசர தரவுகள் மீதான ஒரு உரையாடல் இன்டெலிஜென்ஸ் அடுக்கு — மூல வானிலை தரவை குடிமக்கள், விவசாயிகள், பயணிகள், ஆராய்ச்சியாளர்கள் மற்றும் பேரிடர் கட்டளை மையங்களுக்கான எளிய மொழி முடிவுகளாக மாற்றுகிறது.", "hero_cta_start": "WeatherGPT உடன் தொடங்குங்கள்", "hero_cta_demo": "ஒரு கேள்விக்கான பதிலைப் பாருங்கள் ↓", "hero_trust_1": "இன்டெலிஜென்ஸ் தூண்கள்", "hero_trust_2": "பயனர் வகைகள்", "hero_trust_3": "மெஷ்-தாங்கும் SOS", "demo_question": "“நான் 6 மணிக்கு கிளம்பினால் குடை எடுத்துச் செல்லலாமா?”", "demo_answer": "மாலை 5:40க்குப் பிறகு மழை வாய்ப்பு 68% ஆக அதிகரிக்கிறது — குடையை எடுத்துச் செல்லுங்கள், அதிக மழையைத் தவிர்க்க 10 நிமிடம் முன்னதாக கிளம்புங்கள்.", "pillars_title": "பிரிக்க முடியாத நான்கு தூண்கள்", "pillars_sub": "WeatherGPT-இன் ஒவ்வொரு அம்சமும் இவற்றில் ஒன்றில் உள்ளது — ஒரு குடிமகனின் குடை கேள்வியிலிருந்து கட்டளை மையத்தின் மீட்பு பாதை வரை.", "pillar_weather_title": "வானிலை இன்டெலிஜென்ஸ்", "pillar_predictive_title": "கணிப்பு இன்டெலிஜென்ஸ்", "pillar_impact_title": "தாக்க இன்டெலிஜென்ஸ்", "pillar_response_title": "பதில் இன்டெலிஜென்ஸ்", "features_title": "நீங்கள் முடிவெடுக்கும் விதத்திற்கேற்ப உருவாக்கப்பட்டது", "features_sub": "இது வேறொரு வானிலை ஆப் அல்ல — ஒரு முடிவு அடுக்கு.", "personas_title": "வானத்தின் கீழ் வாழும் அனைவருக்காகவும்", "footer_tagline": "WeatherGPT — AI-அடிப்படையிலான வானிலை மற்றும் பேரிடர் இன்டெலிஜென்ஸ்.", "auth_side_title": "ஒரு கணக்கு. வானிலை தொடர்பான ஒவ்வொரு முடிவும்.", "auth_side_desc": "தனிப்பயனாக்கப்பட்ட கணிப்புகள், உங்கள் பாத்திரத்திற்கேற்ப எச்சரிக்கைகள் மற்றும் நெட்வொர்க் இல்லாதபோதும் செயல்படும் அவசர கருவிகளைத் திறக்க ஒருமுறை உள்நுழையவும்.", "auth_point_1": "உங்கள் அவசர தரவு குறியாக்கம் செய்யப்பட்டு பாதுகாக்கப்படுகிறது", "auth_point_2": "உங்கள் கணிப்பை தனிப்பயனாக்க மட்டுமே இருப்பிடம் பயன்படுத்தப்படுகிறது", "auth_point_3": "ஆங்கிலம் மற்றும் பிராந்திய மொழிகளில் கிடைக்கிறது", "auth_welcome_title": "மீண்டும் வரவேற்கிறோம்", "auth_welcome_sub": "WeatherGPT தொடர உள்நுழையவும்", "tab_phone": "தொலைபேசி", "tab_email": "மின்னஞ்சல்", "btn_send_otp": "OTP அனுப்பு", "otp_title": "6-இலக்க குறியீட்டை உள்ளிடவும்", "otp_sub": "நாங்கள் குறியீட்டை அனுப்பியுள்ளோம்", "btn_verify_otp": "சரிபார்த்து தொடரவும்", "btn_resend": "மீண்டும் அனுப்பு", "otp_change_number": "எண்/மின்னஞ்சலை மாற்று", "profile_title": "உங்கள் சுயவிவரத்தை அமைக்கவும்", "profile_sub": "இது உங்களுக்குக் காட்டப்படும் தகவலை WeatherGPT தனிப்பயனாக்க உதவுகிறது", "label_name": "உங்கள் பெயர்", "label_location": "வீட்டு இருப்பிடம்", "label_role": "நான் முக்கியமாக…", "role_citizen": "குடிமகன்", "role_farmer": "விவசாயி", "role_traveler": "பயணி", "role_researcher": "ஆராய்ச்சியாளர்", "role_official": "அதிகாரி", "btn_finish_profile": "அமைப்பை முடிக்கவும்", "back_to_landing": "பின்செல்", "side_home": "முகப்பு", "side_chat": "அரட்டை", "side_map": "வரைபடம் & ஆபத்துகள்", "side_alerts": "எச்சரிக்கைகள்", "side_plan": "திட்டம்", "side_climate": "காலநிலை & ஆராய்ச்சி", "side_command": "கட்டளை மையம்", "side_sos": "அவசர SOS", "side_new_chat": "புதிய அரட்டை", "home_today_title": "இன்று", "home_hourly_title": "மணிநேர கணிப்பு", "home_week_title": "7-நாள் கணிப்பு", "home_lifestyle_title": "உங்களுக்காக", "home_alerts_preview_title": "செயலில் உள்ள எச்சரிக்கைகள்", "view_all": "அனைத்தையும் காண்க", "alerts_title": "எச்சரிக்கைகள்", "alerts_sub": "உங்கள் பகுதிக்கான அதிகாரப்பூர்வ எச்சரிக்கைகள் மற்றும் ஆலோசனைகள்", "tab_all": "அனைத்தும்", "tab_warnings": "எச்சரிக்கைகள்", "tab_watches": "கண்காணிப்பு", "tab_advisories": "ஆலோசனைகள்", "map_title": "வரைபடம் & ஆபத்துகள்", "layer_radar": "ரேடார்", "layer_lightning": "மின்னல்", "layer_flood": "வெள்ள ஆபத்து", "layer_wind": "காற்று", "layer_sos": "SOS ஹீட்மேப்", "layer_shelters": "தங்குமிடங்கள்", "plan_title": "திட்டம்", "plan_sub": "வானிலை பாதிக்கும் முடிவுகளுக்கான சிறப்பு கருவிகள்", "tab_travel": "பயணம்", "tab_agri": "விவசாயம்", "tab_fitness": "உடற்பயிற்சி", "tab_event": "நிகழ்வு", "tab_marine": "கடல்சார்", "climate_title": "காலநிலை & ஆராய்ச்சி", "climate_sub": "வரலாற்று போக்குகள் மற்றும் முரண்பாடு பகுப்பாய்வு", "label_metric": "அளவீடு", "label_range": "காலஅளவு", "command_title": "கட்டளை மையம்", "command_sub": "நேரடி ஆபத்து, சம்பவம் மற்றும் வளங்களின் மேலோட்டம்", "sos_title": "அவசர SOS", "sos_sub": "சிக்னல் இல்லாதபோதும் மெஷ் நெட்வொர்க்குகளில் செயல்படும்", "sos_button_label": "SOS-க்கு அழுத்திப் பிடிக்கவும்", "sos_cancel": "SOS ரத்து செய்", "profile_settings_title": "சுயவிவரம் & அமைப்புகள்", "label_full_name": "முழு பெயர்", "label_home_location": "வீட்டு இருப்பிடம்", "label_role_pref": "பாத்திரம்", "label_language": "மொழி", "label_units": "அலகுகள்", "label_theme": "தீம்", "label_accessibility": "அணுகல் தன்மை", "label_large_text": "பெரிய எழுத்து", "label_high_contrast": "உயர் மாறுபாடு", "label_reduced_motion": "குறைந்த அசைவூட்டம்", "label_low_data": "குறை-தரவு பயன்முறை", "label_battery_sos": "பேட்டரி-விழிப்புணர்வு SOS", "label_saved_locations": "சேமிக்கப்பட்ட இடங்கள்", "btn_add": "சேர்", "btn_logout": "வெளியேறு", "danger_zone_title": "கணக்கு", "btn_save": "சேமி", "btn_cancel": "ரத்து செய்", "btn_continue": "தொடரவும்", "btn_back": "பின்செல்", "lang_gate_title": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", "lang_gate_sub": "இதை நீங்கள் எப்போது வேண்டுமானாலும் அமைப்புகளில் மாற்றலாம்.", "lang_gate_continue": "தொடரவும்", "restricted_note": "ஆராய்ச்சியாளர் மற்றும் அதிகாரி கணக்குகளுக்கு மட்டும்", "restricted_note_command": "அதிகாரி கணக்குகளுக்கு மட்டும்"}, "gu": {"nav_platform": "પ્લેટફોર્મ", "nav_intelligence": "ઇન્ટેલિજન્સ", "nav_personas": "કોના માટે", "nav_login": "લૉગ ઇન", "nav_start": "શરૂ કરો", "hero_eyebrow": "અંદાજ · તૈયારી · સુરક્ષા · પ્રતિભાવ", "hero_title_1": "હવામાનને ઘણું કહેવાનું છે.", "hero_title_2": "WeatherGPT તમને કહે છે કે તેનો તમારા માટે શું અર્થ છે.", "hero_sub": "રડાર, ઉપગ્રહ, વીજળી, જળવિજ્ઞાન અને કટોકટી ડેટા પર એક વાતચીતાત્મક ઇન્ટેલિજન્સ સ્તર — જે કાચા હવામાન ડેટાને નાગરિકો, ખેડૂતો, પ્રવાસીઓ, સંશોધકો અને આપત્તિ કમાન્ડ કેન્દ્રો માટે સાદી ભાષામાં નિર્ણયોમાં ફેરવે છે.", "hero_cta_start": "WeatherGPT સાથે શરૂ કરો", "hero_cta_demo": "એક પ્રશ્નનો જવાબ જુઓ ↓", "hero_trust_1": "ઇન્ટેલિજન્સ સ્તંભો", "hero_trust_2": "વપરાશકર્તા પ્રકારો", "hero_trust_3": "મેશ-રેઝિલિયન્ટ SOS", "demo_question": "“જો હું 6 વાગ્યે નીકળું તો છત્રી લઈ જવી જોઈએ?”", "demo_answer": "સાંજે 5:40 પછી વરસાદની શક્યતા 68% સુધી વધે છે — છત્રી સાથે રાખો અને સૌથી ભારે વરસાદથી બચવા 10 મિનિટ વહેલા નીકળો.", "pillars_title": "ચાર અવિભાજ્ય સ્તંભો", "pillars_sub": "WeatherGPT ની દરેક સુવિધા આમાંથી એકમાં હોય છે — નાગરિકના છત્રીના પ્રશ્નથી લઈને કમાન્ડ કેન્દ્રના બચાવ માર્ગ સુધી.", "pillar_weather_title": "હવામાન ઇન્ટેલિજન્સ", "pillar_predictive_title": "અંદાજ ઇન્ટેલિજન્સ", "pillar_impact_title": "અસર ઇન્ટેલિજન્સ", "pillar_response_title": "પ્રતિભાવ ઇન્ટેલિજન્સ", "features_title": "તમે નિર્ણય કેવી રીતે લો છો તે મુજબ બનાવેલ", "features_sub": "બીજી હવામાન એપ નહીં — એક નિર્ણય સ્તર.", "personas_title": "આકાશ નીચે રહેતા દરેક માટે", "footer_tagline": "WeatherGPT — AI-આધારિત હવામાન અને આપત્તિ ઇન્ટેલિજન્સ.", "auth_side_title": "એક ખાતું. હવામાન સંબંધિત દરેક નિર્ણય.", "auth_side_desc": "વ્યક્તિગત અંદાજો, તમારી ભૂમિકા મુજબ એલર્ટ્સ અને નેટવર્ક ન હોય ત્યારે પણ કામ કરતા કટોકટી સાધનો અનલૉક કરવા માટે એકવાર સાઇન ઇન કરો.", "auth_point_1": "તમારો કટોકટી ડેટા એન્ક્રિપ્ટેડ અને સુરક્ષિત છે", "auth_point_2": "સ્થાનનો ઉપયોગ ફક્ત તમારો અંદાજ વ્યક્તિગત બનાવવા માટે થાય છે", "auth_point_3": "અંગ્રેજી અને પ્રાદેશિક ભાષાઓમાં ઉપલબ્ધ", "auth_welcome_title": "પાછા સ્વાગત છે", "auth_welcome_sub": "WeatherGPT ચાલુ રાખવા સાઇન ઇન કરો", "tab_phone": "ફોન", "tab_email": "ઈમેલ", "btn_send_otp": "OTP મોકલો", "otp_title": "6-અંકનો કોડ દાખલ કરો", "otp_sub": "અમે કોડ મોકલ્યો છે", "btn_verify_otp": "ચકાસો અને ચાલુ રાખો", "btn_resend": "ફરી મોકલો", "otp_change_number": "નંબર/ઈમેલ બદલો", "profile_title": "તમારી પ્રોફાઇલ સેટ કરો", "profile_sub": "આ WeatherGPT ને તમને બતાવવામાં આવતી માહિતી વ્યક્તિગત બનાવવામાં મદદ કરે છે", "label_name": "તમારું નામ", "label_location": "ઘરનું સ્થાન", "label_role": "હું મુખ્યત્વે…", "role_citizen": "નાગરિક", "role_farmer": "ખેડૂત", "role_traveler": "પ્રવાસી", "role_researcher": "સંશોધક", "role_official": "અધિકારી", "btn_finish_profile": "સેટઅપ પૂર્ણ કરો", "back_to_landing": "પાછળ", "side_home": "હોમ", "side_chat": "ચેટ", "side_map": "નકશો અને જોખમો", "side_alerts": "એલર્ટ્સ", "side_plan": "યોજના", "side_climate": "આબોહવા અને સંશોધન", "side_command": "કમાન્ડ કેન્દ્ર", "side_sos": "કટોકટી SOS", "side_new_chat": "નવી ચેટ", "home_today_title": "આજે", "home_hourly_title": "કલાકવાર અંદાજ", "home_week_title": "7-દિવસનો અંદાજ", "home_lifestyle_title": "તમારા માટે", "home_alerts_preview_title": "સક્રિય એલર્ટ્સ", "view_all": "બધા જુઓ", "alerts_title": "એલર્ટ્સ", "alerts_sub": "તમારા વિસ્તાર માટે સત્તાવાર ચેતવણીઓ અને સલાહ", "tab_all": "બધા", "tab_warnings": "ચેતવણીઓ", "tab_watches": "નિરીક્ષણ", "tab_advisories": "સલાહ", "map_title": "નકશો અને જોખમો", "layer_radar": "રડાર", "layer_lightning": "વીજળી", "layer_flood": "પૂરનું જોખમ", "layer_wind": "પવન", "layer_sos": "SOS હીટમેપ", "layer_shelters": "આશ્રયસ્થાનો", "plan_title": "યોજના", "plan_sub": "હવામાનથી પ્રભાવિત નિર્ણયો માટે ખાસ સાધનો", "tab_travel": "પ્રવાસ", "tab_agri": "ખેતી", "tab_fitness": "ફિટનેસ", "tab_event": "કાર્યક્રમ", "tab_marine": "દરિયાઈ", "climate_title": "આબોહવા અને સંશોધન", "climate_sub": "ઐતિહાસિક વલણો અને વિસંગતતા વિશ્લેષણ", "label_metric": "મેટ્રિક", "label_range": "સમયગાળો", "command_title": "કમાન્ડ કેન્દ્ર", "command_sub": "જીવંત જોખમ, ઘટના અને સંસાધન ઝાંખી", "sos_title": "કટોકટી SOS", "sos_sub": "નેટવર્ક ન હોય ત્યારે પણ મેશ નેટવર્ક પર કામ કરે છે", "sos_button_label": "SOS માટે દબાવી રાખો", "sos_cancel": "SOS રદ કરો", "profile_settings_title": "પ્રોફાઇલ અને સેટિંગ્સ", "label_full_name": "પૂરું નામ", "label_home_location": "ઘરનું સ્થાન", "label_role_pref": "ભૂમિકા", "label_language": "ભાષા", "label_units": "એકમો", "label_theme": "થીમ", "label_accessibility": "સુલભતા", "label_large_text": "મોટું લખાણ", "label_high_contrast": "ઉચ્ચ કોન્ટ્રાસ્ટ", "label_reduced_motion": "ઓછું એનિમેશન", "label_low_data": "લો-ડેટા મોડ", "label_battery_sos": "બેટરી-જાગૃત SOS", "label_saved_locations": "સાચવેલા સ્થાનો", "btn_add": "ઉમેરો", "btn_logout": "લૉગ આઉટ", "danger_zone_title": "ખાતું", "btn_save": "સાચવો", "btn_cancel": "રદ કરો", "btn_continue": "ચાલુ રાખો", "btn_back": "પાછળ", "lang_gate_title": "તમારી ભાષા પસંદ કરો", "lang_gate_sub": "તમે આ કોઈપણ સમયે સેટિંગ્સમાંથી બદલી શકો છો.", "lang_gate_continue": "ચાલુ રાખો", "restricted_note": "સંશોધક અને અધિકારી ખાતાઓ માટે ઉપલબ્ધ", "restricted_note_command": "અધિકારી ખાતાઓ માટે ઉપલબ્ધ"}, "kn": {"nav_platform": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್", "nav_intelligence": "ಇಂಟೆಲಿಜೆನ್ಸ್", "nav_personas": "ಯಾರಿಗಾಗಿ", "nav_login": "ಲಾಗಿನ್", "nav_start": "ಪ್ರಾರಂಭಿಸಿ", "hero_eyebrow": "ಮುನ್ಸೂಚನೆ · ಸಿದ್ಧತೆ · ರಕ್ಷಣೆ · ಪ್ರತಿಕ್ರಿಯೆ", "hero_title_1": "ಹವಾಮಾನಕ್ಕೆ ಹೇಳಲು ಬಹಳಷ್ಟಿದೆ.", "hero_title_2": "ಅದು ನಿಮಗೆ ಏನು ಅರ್ಥ ಎಂದು WeatherGPT ಹೇಳುತ್ತದೆ.", "hero_sub": "ರೇಡಾರ್, ಉಪಗ್ರಹ, ಮಿಂಚು, ಜಲವಿಜ್ಞಾನ ಮತ್ತು ತುರ್ತು ಡೇಟಾದ ಮೇಲೆ ಒಂದು ಸಂಭಾಷಣಾ ಇಂಟೆಲಿಜೆನ್ಸ್ ಪದರ — ಇದು ಕಚ್ಚಾ ಹವಾಮಾನ ಡೇಟಾವನ್ನು ನಾಗರಿಕರು, ರೈತರು, ಪ್ರವಾಸಿಗರು, ಸಂಶೋಧಕರು ಮತ್ತು ವಿಪತ್ತು ಕಮಾಂಡ್ ಕೇಂದ್ರಗಳಿಗೆ ಸರಳ ಭಾಷೆಯ ನಿರ್ಧಾರಗಳಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.", "hero_cta_start": "WeatherGPT ಜೊತೆ ಪ್ರಾರಂಭಿಸಿ", "hero_cta_demo": "ಒಂದು ಪ್ರಶ್ನೆಗೆ ಉತ್ತರ ನೋಡಿ ↓", "hero_trust_1": "ಇಂಟೆಲಿಜೆನ್ಸ್ ಸ್ತಂಭಗಳು", "hero_trust_2": "ಬಳಕೆದಾರ ಪ್ರಕಾರಗಳು", "hero_trust_3": "ಮೆಶ್-ಸ್ಥಿತಿಸ್ಥಾಪಕ SOS", "demo_question": "“ನಾನು 6 ಗಂಟೆಗೆ ಹೊರಟರೆ ಛತ್ರಿ ತೆಗೆದುಕೊಳ್ಳಬೇಕೇ?”", "demo_answer": "ಸಂಜೆ 5:40 ರ ನಂತರ ಮಳೆಯ ಸಾಧ್ಯತೆ 68% ಗೆ ಏರುತ್ತದೆ — ಛತ್ರಿ ತೆಗೆದುಕೊಳ್ಳಿ, ಭಾರೀ ಮಳೆಯನ್ನು ತಪ್ಪಿಸಲು 10 ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಹೊರಡಿ.", "pillars_title": "ನಾಲ್ಕು ಬೇರ್ಪಡಿಸಲಾಗದ ಸ್ತಂಭಗಳು", "pillars_sub": "WeatherGPT ನ ಪ್ರತಿಯೊಂದು ವೈಶಿಷ್ಟ್ಯವು ಇವುಗಳಲ್ಲಿ ಒಂದರಲ್ಲಿದೆ — ನಾಗರಿಕನ ಛತ್ರಿ ಪ್ರಶ್ನೆಯಿಂದ ಕಮಾಂಡ್ ಕೇಂದ್ರದ ರಕ್ಷಣಾ ಮಾರ್ಗದವರೆಗೆ.", "pillar_weather_title": "ಹವಾಮಾನ ಇಂಟೆಲಿಜೆನ್ಸ್", "pillar_predictive_title": "ಮುನ್ಸೂಚನಾ ಇಂಟೆಲಿಜೆನ್ಸ್", "pillar_impact_title": "ಪರಿಣಾಮ ಇಂಟೆಲಿಜೆನ್ಸ್", "pillar_response_title": "ಪ್ರತಿಕ್ರಿಯೆ ಇಂಟೆಲಿಜೆನ್ಸ್", "features_title": "ನೀವು ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ರೀತಿಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿಸಲಾಗಿದೆ", "features_sub": "ಇದು ಇನ್ನೊಂದು ಹವಾಮಾನ ಆ್ಯಪ್ ಅಲ್ಲ — ಒಂದು ನಿರ್ಧಾರ ಪದರ.", "personas_title": "ಆಕಾಶದ ಕೆಳಗೆ ವಾಸಿಸುವ ಎಲ್ಲರಿಗಾಗಿ", "footer_tagline": "WeatherGPT — AI-ಆಧಾರಿತ ಹವಾಮಾನ ಮತ್ತು ವಿಪತ್ತು ಇಂಟೆಲಿಜೆನ್ಸ್.", "auth_side_title": "ಒಂದು ಖಾತೆ. ಹವಾಮಾನ ಸಂಬಂಧಿತ ಪ್ರತಿ ನಿರ್ಧಾರ.", "auth_side_desc": "ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಮುನ್ಸೂಚನೆಗಳು, ನಿಮ್ಮ ಪಾತ್ರಕ್ಕೆ ಅನುಗುಣವಾದ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದಾಗಲೂ ಕೆಲಸ ಮಾಡುವ ತುರ್ತು ಸಾಧನಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಒಮ್ಮೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.", "auth_point_1": "ನಿಮ್ಮ ತುರ್ತು ಡೇಟಾ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿದೆ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆ", "auth_point_2": "ನಿಮ್ಮ ಮುನ್ಸೂಚನೆಯನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಮಾತ್ರ ಸ್ಥಳ ಬಳಸಲಾಗುತ್ತದೆ", "auth_point_3": "ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ", "auth_welcome_title": "ಮತ್ತೆ ಸ್ವಾಗತ", "auth_welcome_sub": "WeatherGPT ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ", "tab_phone": "ಫೋನ್", "tab_email": "ಇಮೇಲ್", "btn_send_otp": "OTP ಕಳುಹಿಸಿ", "otp_title": "6-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ", "otp_sub": "ನಾವು ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇವೆ", "btn_verify_otp": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ", "btn_resend": "ಮತ್ತೆ ಕಳುಹಿಸಿ", "otp_change_number": "ಸಂಖ್ಯೆ/ಇಮೇಲ್ ಬದಲಾಯಿಸಿ", "profile_title": "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ", "profile_sub": "ಇದು ನಿಮಗೆ ತೋರಿಸುವ ಮಾಹಿತಿಯನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು WeatherGPT ಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ", "label_name": "ನಿಮ್ಮ ಹೆಸರು", "label_location": "ಮನೆಯ ಸ್ಥಳ", "label_role": "ನಾನು ಮುಖ್ಯವಾಗಿ…", "role_citizen": "ನಾಗರಿಕ", "role_farmer": "ರೈತ", "role_traveler": "ಪ್ರವಾಸಿ", "role_researcher": "ಸಂಶೋಧಕ", "role_official": "ಅಧಿಕಾರಿ", "btn_finish_profile": "ಸೆಟಪ್ ಮುಗಿಸಿ", "back_to_landing": "ಹಿಂದೆ", "side_home": "ಹೋಮ್", "side_chat": "ಚಾಟ್", "side_map": "ನಕ್ಷೆ ಮತ್ತು ಅಪಾಯಗಳು", "side_alerts": "ಎಚ್ಚರಿಕೆಗಳು", "side_plan": "ಯೋಜನೆ", "side_climate": "ಹವಾಮಾನ ಮತ್ತು ಸಂಶೋಧನೆ", "side_command": "ಕಮಾಂಡ್ ಕೇಂದ್ರ", "side_sos": "ತುರ್ತು SOS", "side_new_chat": "ಹೊಸ ಚಾಟ್", "home_today_title": "ಇಂದು", "home_hourly_title": "ಗಂಟೆಗೊಮ್ಮೆ ಮುನ್ಸೂಚನೆ", "home_week_title": "7-ದಿನದ ಮುನ್ಸೂಚನೆ", "home_lifestyle_title": "ನಿಮಗಾಗಿ", "home_alerts_preview_title": "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು", "view_all": "ಎಲ್ಲಾ ನೋಡಿ", "alerts_title": "ಎಚ್ಚರಿಕೆಗಳು", "alerts_sub": "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಅಧಿಕೃತ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸಲಹೆಗಳು", "tab_all": "ಎಲ್ಲಾ", "tab_warnings": "ಎಚ್ಚರಿಕೆಗಳು", "tab_watches": "ವೀಕ್ಷಣೆಗಳು", "tab_advisories": "ಸಲಹೆಗಳು", "map_title": "ನಕ್ಷೆ ಮತ್ತು ಅಪಾಯಗಳು", "layer_radar": "ರೇಡಾರ್", "layer_lightning": "ಮಿಂಚು", "layer_flood": "ಪ್ರವಾಹ ಅಪಾಯ", "layer_wind": "ಗಾಳಿ", "layer_sos": "SOS ಹೀಟ್‌ಮ್ಯಾಪ್", "layer_shelters": "ಆಶ್ರಯಗಳು", "plan_title": "ಯೋಜನೆ", "plan_sub": "ಹವಾಮಾನ ಪ್ರಭಾವಿತ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ವಿಶೇಷ ಸಾಧನಗಳು", "tab_travel": "ಪ್ರಯಾಣ", "tab_agri": "ಕೃಷಿ", "tab_fitness": "ಫಿಟ್‌ನೆಸ್", "tab_event": "ಕಾರ್ಯಕ್ರಮ", "tab_marine": "ಸಮುದ್ರ", "climate_title": "ಹವಾಮಾನ ಮತ್ತು ಸಂಶೋಧನೆ", "climate_sub": "ಐತಿಹಾಸಿಕ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ವೈಪರೀತ್ಯ ವಿಶ್ಲೇಷಣೆ", "label_metric": "ಮೆಟ್ರಿಕ್", "label_range": "ಅವಧಿ", "command_title": "ಕಮಾಂಡ್ ಕೇಂದ್ರ", "command_sub": "ನೇರ ಅಪಾಯ, ಘಟನೆ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಅವಲೋಕನ", "sos_title": "ತುರ್ತು SOS", "sos_sub": "ಸಿಗ್ನಲ್ ಇಲ್ಲದಿದ್ದರೂ ಮೆಶ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ", "sos_button_label": "SOS ಗಾಗಿ ಒತ್ತಿ ಹಿಡಿಯಿರಿ", "sos_cancel": "SOS ರದ್ದುಮಾಡಿ", "profile_settings_title": "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "label_full_name": "ಪೂರ್ಣ ಹೆಸರು", "label_home_location": "ಮನೆಯ ಸ್ಥಳ", "label_role_pref": "ಪಾತ್ರ", "label_language": "ಭಾಷೆ", "label_units": "ಘಟಕಗಳು", "label_theme": "ಥೀಮ್", "label_accessibility": "ಪ್ರವೇಶಿಸುವಿಕೆ", "label_large_text": "ದೊಡ್ಡ ಪಠ್ಯ", "label_high_contrast": "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್", "label_reduced_motion": "ಕಡಿಮೆ ಚಲನೆ", "label_low_data": "ಕಡಿಮೆ-ಡೇಟಾ ಮೋಡ್", "label_battery_sos": "ಬ್ಯಾಟರಿ-ಅರಿವಿನ SOS", "label_saved_locations": "ಉಳಿಸಿದ ಸ್ಥಳಗಳು", "btn_add": "ಸೇರಿಸಿ", "btn_logout": "ಲಾಗ್ ಔಟ್", "danger_zone_title": "ಖಾತೆ", "btn_save": "ಉಳಿಸಿ", "btn_cancel": "ರದ್ದುಮಾಡಿ", "btn_continue": "ಮುಂದುವರಿಸಿ", "btn_back": "ಹಿಂದೆ", "lang_gate_title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", "lang_gate_sub": "ನೀವು ಇದನ್ನು ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಂದ ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಬಹುದು.", "lang_gate_continue": "ಮುಂದುವರಿಸಿ", "restricted_note": "ಸಂಶೋಧಕ ಮತ್ತು ಅಧಿಕಾರಿ ಖಾತೆಗಳಿಗೆ ಮಾತ್ರ ಲಭ್ಯ", "restricted_note_command": "ಅಧಿಕಾರಿ ಖಾತೆಗಳಿಗೆ ಮಾತ್ರ ಲಭ್ಯ"}, "ml": {"nav_platform": "പ്ലാറ്റ്‌ഫോം", "nav_intelligence": "ഇന്റലിജൻസ്", "nav_personas": "ആർക്കുവേണ്ടി", "nav_login": "ലോഗിൻ", "nav_start": "ആരംഭിക്കുക", "hero_eyebrow": "പ്രവചനം · തയ്യാറെടുപ്പ് · സംരക്ഷണം · പ്രതികരണം", "hero_title_1": "കാലാവസ്ഥയ്ക്ക് പറയാൻ ഒരുപാടുണ്ട്.", "hero_title_2": "അതിന്റെ അർത്ഥം നിങ്ങൾക്കായി WeatherGPT പറയുന്നു.", "hero_sub": "റഡാർ, ഉപഗ്രഹം, മിന്നൽ, ജലശാസ്ത്രം, അടിയന്തര ഡാറ്റ എന്നിവയ്ക്ക് മുകളിലുള്ള ഒരു സംഭാഷണ ഇന്റലിജൻസ് പാളി — പൗരന്മാർ, കർഷകർ, യാത്രക്കാർ, ഗവേഷകർ, ദുരന്ത കമാൻഡ് കേന്ദ്രങ്ങൾ എന്നിവർക്കായി അസംസ്കൃത കാലാവസ്ഥാ ഡാറ്റയെ ലളിതമായ ഭാഷയിലുള്ള തീരുമാനങ്ങളാക്കി മാറ്റുന്നു.", "hero_cta_start": "WeatherGPT ഉപയോഗിച്ച് ആരംഭിക്കുക", "hero_cta_demo": "ഒരു ചോദ്യത്തിന് ഉത്തരം കാണുക ↓", "hero_trust_1": "ഇന്റലിജൻസ് സ്തംഭങ്ങൾ", "hero_trust_2": "ഉപയോക്തൃ തരങ്ങൾ", "hero_trust_3": "മെഷ്-റെസിലിയന്റ് SOS", "demo_question": "“ഞാൻ 6 മണിക്ക് ഇറങ്ങിയാൽ കുട എടുക്കണോ?”", "demo_answer": "വൈകുന്നേരം 5:40 ന് ശേഷം മഴയ്ക്കുള്ള സാധ്യത 68% ആയി ഉയരുന്നു — കുട കൊണ്ടുപോകൂ, ഏറ്റവും കനത്ത മഴ ഒഴിവാക്കാൻ 10 മിനിറ്റ് നേരത്തെ ഇറങ്ങൂ.", "pillars_title": "നാല് അഭേദ്യമായ സ്തംഭങ്ങൾ", "pillars_sub": "WeatherGPT-യിലെ ഓരോ ഫീച്ചറും ഇവയിലൊന്നിലാണ് — ഒരു പൗരന്റെ കുട ചോദ്യം മുതൽ കമാൻഡ് കേന്ദ്രത്തിന്റെ രക്ഷാ പാത വരെ.", "pillar_weather_title": "കാലാവസ്ഥാ ഇന്റലിജൻസ്", "pillar_predictive_title": "പ്രവചന ഇന്റലിജൻസ്", "pillar_impact_title": "ആഘാത ഇന്റലിജൻസ്", "pillar_response_title": "പ്രതികരണ ഇന്റലിജൻസ്", "features_title": "നിങ്ങൾ തീരുമാനങ്ങൾ എടുക്കുന്ന രീതിക്കനുസരിച്ച് നിർമ്മിച്ചത്", "features_sub": "മറ്റൊരു കാലാവസ്ഥാ ആപ്പല്ല — ഒരു തീരുമാന പാളി.", "personas_title": "ആകാശത്തിനു കീഴിൽ ജീവിക്കുന്ന എല്ലാവർക്കും വേണ്ടി", "footer_tagline": "WeatherGPT — AI-അധിഷ്ഠിത കാലാവസ്ഥാ, ദുരന്ത ഇന്റലിജൻസ്.", "auth_side_title": "ഒരു അക്കൗണ്ട്. കാലാവസ്ഥയുമായി ബന്ധപ്പെട്ട എല്ലാ തീരുമാനവും.", "auth_side_desc": "വ്യക്തിഗതമാക്കിയ പ്രവചനങ്ങൾ, നിങ്ങളുടെ റോളിനനുസരിച്ചുള്ള അലേർട്ടുകൾ, നെറ്റ്‌വർക്ക് ഇല്ലാത്തപ്പോഴും പ്രവർത്തിക്കുന്ന അടിയന്തര ഉപകരണങ്ങൾ എന്നിവ അൺലോക്ക് ചെയ്യാൻ ഒരിക്കൽ സൈൻ ഇൻ ചെയ്യുക.", "auth_point_1": "നിങ്ങളുടെ അടിയന്തര ഡാറ്റ എൻക്രിപ്റ്റ് ചെയ്തതും സുരക്ഷിതവുമാണ്", "auth_point_2": "നിങ്ങളുടെ പ്രവചനം വ്യക്തിഗതമാക്കാൻ മാത്രമേ സ്ഥാനം ഉപയോഗിക്കൂ", "auth_point_3": "ഇംഗ്ലീഷിലും പ്രാദേശിക ഭാഷകളിലും ലഭ്യമാണ്", "auth_welcome_title": "വീണ്ടും സ്വാഗതം", "auth_welcome_sub": "WeatherGPT തുടരാൻ സൈൻ ഇൻ ചെയ്യുക", "tab_phone": "ഫോൺ", "tab_email": "ഇമെയിൽ", "btn_send_otp": "OTP അയയ്ക്കുക", "otp_title": "6 അക്ക കോഡ് നൽകുക", "otp_sub": "ഞങ്ങൾ കോഡ് അയച്ചു", "btn_verify_otp": "സ്ഥിരീകരിച്ച് തുടരുക", "btn_resend": "വീണ്ടും അയയ്ക്കുക", "otp_change_number": "നമ്പർ/ഇമെയിൽ മാറ്റുക", "profile_title": "നിങ്ങളുടെ പ്രൊഫൈൽ സജ്ജീകരിക്കുക", "profile_sub": "നിങ്ങൾക്ക് കാണിക്കുന്ന വിവരങ്ങൾ വ്യക്തിഗതമാക്കാൻ ഇത് WeatherGPT-യെ സഹായിക്കുന്നു", "label_name": "നിങ്ങളുടെ പേര്", "label_location": "വീട്ടിലെ സ്ഥലം", "label_role": "ഞാൻ പ്രധാനമായും…", "role_citizen": "പൗരൻ", "role_farmer": "കർഷകൻ", "role_traveler": "യാത്രക്കാരൻ", "role_researcher": "ഗവേഷകൻ", "role_official": "ഉദ്യോഗസ്ഥൻ", "btn_finish_profile": "സജ്ജീകരണം പൂർത്തിയാക്കുക", "back_to_landing": "തിരികെ", "side_home": "ഹോം", "side_chat": "ചാറ്റ്", "side_map": "മാപ്പും അപകടങ്ങളും", "side_alerts": "അലേർട്ടുകൾ", "side_plan": "പ്ലാൻ", "side_climate": "കാലാവസ്ഥയും ഗവേഷണവും", "side_command": "കമാൻഡ് കേന്ദ്രം", "side_sos": "അടിയന്തര SOS", "side_new_chat": "പുതിയ ചാറ്റ്", "home_today_title": "ഇന്ന്", "home_hourly_title": "മണിക്കൂർ പ്രവചനം", "home_week_title": "7-ദിവസത്തെ പ്രവചനം", "home_lifestyle_title": "നിങ്ങൾക്കായി", "home_alerts_preview_title": "സജീവ അലേർട്ടുകൾ", "view_all": "എല്ലാം കാണുക", "alerts_title": "അലേർട്ടുകൾ", "alerts_sub": "നിങ്ങളുടെ പ്രദേശത്തിനുള്ള ഔദ്യോഗിക മുന്നറിയിപ്പുകളും ഉപദേശങ്ങളും", "tab_all": "എല്ലാം", "tab_warnings": "മുന്നറിയിപ്പുകൾ", "tab_watches": "നിരീക്ഷണങ്ങൾ", "tab_advisories": "ഉപദേശങ്ങൾ", "map_title": "മാപ്പും അപകടങ്ങളും", "layer_radar": "റഡാർ", "layer_lightning": "മിന്നൽ", "layer_flood": "വെള്ളപ്പൊക്ക അപകടം", "layer_wind": "കാറ്റ്", "layer_sos": "SOS ഹീറ്റ്മാപ്പ്", "layer_shelters": "അഭയകേന്ദ്രങ്ങൾ", "plan_title": "പ്ലാൻ", "plan_sub": "കാലാവസ്ഥ ബാധിക്കുന്ന തീരുമാനങ്ങൾക്കുള്ള പ്രത്യേക ഉപകരണങ്ങൾ", "tab_travel": "യാത്ര", "tab_agri": "കൃഷി", "tab_fitness": "ഫിറ്റ്നസ്", "tab_event": "പരിപാടി", "tab_marine": "സമുദ്ര", "climate_title": "കാലാവസ്ഥയും ഗവേഷണവും", "climate_sub": "ചരിത്രപരമായ പ്രവണതകളും അപവാദ വിശകലനവും", "label_metric": "മെട്രിക്", "label_range": "കാലയളവ്", "command_title": "കമാൻഡ് കേന്ദ്രം", "command_sub": "തത്സമയ അപകടം, സംഭവം, വിഭവ അവലോകനം", "sos_title": "അടിയന്തര SOS", "sos_sub": "സിഗ്നൽ ഇല്ലെങ്കിലും മെഷ് നെറ്റ്‌വർക്കുകളിൽ പ്രവർത്തിക്കുന്നു", "sos_button_label": "SOS-ന് അമർത്തിപ്പിടിക്കുക", "sos_cancel": "SOS റദ്ദാക്കുക", "profile_settings_title": "പ്രൊഫൈലും ക്രമീകരണങ്ങളും", "label_full_name": "മുഴുവൻ പേര്", "label_home_location": "വീട്ടിലെ സ്ഥലം", "label_role_pref": "റോൾ", "label_language": "ഭാഷ", "label_units": "യൂണിറ്റുകൾ", "label_theme": "തീം", "label_accessibility": "പ്രാപ്യത", "label_large_text": "വലിയ ടെക്സ്റ്റ്", "label_high_contrast": "ഉയർന്ന കോൺട്രാസ്റ്റ്", "label_reduced_motion": "കുറഞ്ഞ ചലനം", "label_low_data": "ലോ-ഡാറ്റ മോഡ്", "label_battery_sos": "ബാറ്ററി-ബോധവൽക്കരണ SOS", "label_saved_locations": "സംരക്ഷിച്ച സ്ഥലങ്ങൾ", "btn_add": "ചേർക്കുക", "btn_logout": "ലോഗ് ഔട്ട്", "danger_zone_title": "അക്കൗണ്ട്", "btn_save": "സംരക്ഷിക്കുക", "btn_cancel": "റദ്ദാക്കുക", "btn_continue": "തുടരുക", "btn_back": "തിരികെ", "lang_gate_title": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", "lang_gate_sub": "ഇത് നിങ്ങൾക്ക് എപ്പോൾ വേണമെങ്കിലും ക്രമീകരണങ്ങളിൽ നിന്ന് മാറ്റാം.", "lang_gate_continue": "തുടരുക", "restricted_note": "ഗവേഷക, ഉദ്യോഗസ്ഥ അക്കൗണ്ടുകൾക്ക് മാത്രം ലഭ്യം", "restricted_note_command": "ഉദ്യോഗസ്ഥ അക്കൗണ്ടുകൾക്ക് മാത്രം ലഭ്യം"}, "pa": {"nav_platform": "ਪਲੇਟਫਾਰਮ", "nav_intelligence": "ਇੰਟੈਲੀਜੈਂਸ", "nav_personas": "ਕਿਸ ਲਈ", "nav_login": "ਲੌਗ ਇਨ", "nav_start": "ਸ਼ੁਰੂ ਕਰੋ", "hero_eyebrow": "ਅਨੁਮਾਨ · ਤਿਆਰੀ · ਸੁਰੱਖਿਆ · ਪ੍ਰਤੀਕਿਰਿਆ", "hero_title_1": "ਮੌਸਮ ਕੋਲ ਕਹਿਣ ਲਈ ਬਹੁਤ ਕੁਝ ਹੈ।", "hero_title_2": "WeatherGPT ਤੁਹਾਨੂੰ ਦੱਸਦਾ ਹੈ ਕਿ ਇਸਦਾ ਤੁਹਾਡੇ ਲਈ ਕੀ ਮਤਲਬ ਹੈ।", "hero_sub": "ਰਾਡਾਰ, ਸੈਟੇਲਾਈਟ, ਬਿਜਲੀ, ਜਲ-ਵਿਗਿਆਨ ਅਤੇ ਐਮਰਜੈਂਸੀ ਡਾਟਾ ਉੱਤੇ ਇੱਕ ਗੱਲਬਾਤ ਵਾਲੀ ਇੰਟੈਲੀਜੈਂਸ ਪਰਤ — ਜੋ ਕੱਚੇ ਮੌਸਮ ਡਾਟੇ ਨੂੰ ਨਾਗਰਿਕਾਂ, ਕਿਸਾਨਾਂ, ਯਾਤਰੀਆਂ, ਖੋਜਕਾਰਾਂ ਅਤੇ ਆਫ਼ਤ ਕਮਾਂਡ ਕੇਂਦਰਾਂ ਲਈ ਸਾਦੀ ਭਾਸ਼ਾ ਦੇ ਫੈਸਲਿਆਂ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।", "hero_cta_start": "WeatherGPT ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ", "hero_cta_demo": "ਇੱਕ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦੇਖੋ ↓", "hero_trust_1": "ਇੰਟੈਲੀਜੈਂਸ ਥੰਮ੍ਹ", "hero_trust_2": "ਵਰਤੋਂਕਾਰ ਕਿਸਮਾਂ", "hero_trust_3": "ਮੈਸ਼-ਰੈਜ਼ੀਲੀਐਂਟ SOS", "demo_question": "“ਜੇ ਮੈਂ 6 ਵਜੇ ਨਿਕਲਾਂ ਤਾਂ ਕੀ ਛਤਰੀ ਲੈ ਜਾਵਾਂ?”", "demo_answer": "ਸ਼ਾਮ 5:40 ਤੋਂ ਬਾਅਦ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ 68% ਤੱਕ ਵੱਧ ਜਾਂਦੀ ਹੈ — ਛਤਰੀ ਨਾਲ ਲੈ ਜਾਓ ਅਤੇ ਸਭ ਤੋਂ ਭਾਰੀ ਮੀਂਹ ਤੋਂ ਬਚਣ ਲਈ 10 ਮਿੰਟ ਪਹਿਲਾਂ ਨਿਕਲੋ।", "pillars_title": "ਚਾਰ ਅਟੁੱਟ ਥੰਮ੍ਹ", "pillars_sub": "WeatherGPT ਦੀ ਹਰ ਵਿਸ਼ੇਸ਼ਤਾ ਇਹਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਵਿੱਚ ਹੈ — ਇੱਕ ਨਾਗਰਿਕ ਦੇ ਛਤਰੀ ਸਵਾਲ ਤੋਂ ਲੈ ਕੇ ਕਮਾਂਡ ਕੇਂਦਰ ਦੇ ਬਚਾਅ ਰਸਤੇ ਤੱਕ।", "pillar_weather_title": "ਮੌਸਮ ਇੰਟੈਲੀਜੈਂਸ", "pillar_predictive_title": "ਅਨੁਮਾਨ ਇੰਟੈਲੀਜੈਂਸ", "pillar_impact_title": "ਪ੍ਰਭਾਵ ਇੰਟੈਲੀਜੈਂਸ", "pillar_response_title": "ਪ੍ਰਤੀਕਿਰਿਆ ਇੰਟੈਲੀਜੈਂਸ", "features_title": "ਤੁਹਾਡੇ ਫੈਸਲੇ ਲੈਣ ਦੇ ਤਰੀਕੇ ਮੁਤਾਬਕ ਬਣਾਇਆ ਗਿਆ", "features_sub": "ਇੱਕ ਹੋਰ ਮੌਸਮ ਐਪ ਨਹੀਂ — ਇੱਕ ਫੈਸਲਾ ਪਰਤ।", "personas_title": "ਅਸਮਾਨ ਹੇਠ ਰਹਿਣ ਵਾਲੇ ਹਰ ਕਿਸੇ ਲਈ", "footer_tagline": "WeatherGPT — AI-ਅਧਾਰਿਤ ਮੌਸਮ ਅਤੇ ਆਫ਼ਤ ਇੰਟੈਲੀਜੈਂਸ।", "auth_side_title": "ਇੱਕ ਖਾਤਾ। ਮੌਸਮ ਨਾਲ ਜੁੜਿਆ ਹਰ ਫੈਸਲਾ।", "auth_side_desc": "ਵਿਅਕਤੀਗਤ ਅਨੁਮਾਨ, ਤੁਹਾਡੀ ਭੂਮਿਕਾ ਮੁਤਾਬਕ ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਨੈੱਟਵਰਕ ਨਾ ਹੋਣ 'ਤੇ ਵੀ ਕੰਮ ਕਰਨ ਵਾਲੇ ਐਮਰਜੈਂਸੀ ਟੂਲ ਅਨਲੌਕ ਕਰਨ ਲਈ ਇੱਕ ਵਾਰ ਸਾਈਨ ਇਨ ਕਰੋ।", "auth_point_1": "ਤੁਹਾਡਾ ਐਮਰਜੈਂਸੀ ਡਾਟਾ ਇਨਕ੍ਰਿਪਟਡ ਅਤੇ ਸੁਰੱਖਿਅਤ ਹੈ", "auth_point_2": "ਟਿਕਾਣਾ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਅਨੁਮਾਨ ਨੂੰ ਵਿਅਕਤੀਗਤ ਬਣਾਉਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ", "auth_point_3": "ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ", "auth_welcome_title": "ਮੁੜ ਸੁਆਗਤ ਹੈ", "auth_welcome_sub": "WeatherGPT ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ", "tab_phone": "ਫੋਨ", "tab_email": "ਈਮੇਲ", "btn_send_otp": "OTP ਭੇਜੋ", "otp_title": "6-ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਰਜ ਕਰੋ", "otp_sub": "ਅਸੀਂ ਕੋਡ ਭੇਜਿਆ ਹੈ", "btn_verify_otp": "ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਜਾਰੀ ਰੱਖੋ", "btn_resend": "ਦੁਬਾਰਾ ਭੇਜੋ", "otp_change_number": "ਨੰਬਰ/ਈਮੇਲ ਬਦਲੋ", "profile_title": "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਸੈੱਟ ਕਰੋ", "profile_sub": "ਇਹ WeatherGPT ਨੂੰ ਤੁਹਾਨੂੰ ਦਿਖਾਈ ਜਾਂਦੀ ਜਾਣਕਾਰੀ ਨੂੰ ਵਿਅਕਤੀਗਤ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "label_name": "ਤੁਹਾਡਾ ਨਾਮ", "label_location": "ਘਰ ਦਾ ਟਿਕਾਣਾ", "label_role": "ਮੈਂ ਮੁੱਖ ਤੌਰ 'ਤੇ ਹਾਂ…", "role_citizen": "ਨਾਗਰਿਕ", "role_farmer": "ਕਿਸਾਨ", "role_traveler": "ਯਾਤਰੀ", "role_researcher": "ਖੋਜਕਾਰ", "role_official": "ਅਧਿਕਾਰੀ", "btn_finish_profile": "ਸੈੱਟਅੱਪ ਪੂਰਾ ਕਰੋ", "back_to_landing": "ਪਿੱਛੇ", "side_home": "ਹੋਮ", "side_chat": "ਚੈਟ", "side_map": "ਨਕਸ਼ਾ ਅਤੇ ਖ਼ਤਰੇ", "side_alerts": "ਚੇਤਾਵਨੀਆਂ", "side_plan": "ਯੋਜਨਾ", "side_climate": "ਜਲਵਾਯੂ ਅਤੇ ਖੋਜ", "side_command": "ਕਮਾਂਡ ਕੇਂਦਰ", "side_sos": "ਐਮਰਜੈਂਸੀ SOS", "side_new_chat": "ਨਵੀਂ ਚੈਟ", "home_today_title": "ਅੱਜ", "home_hourly_title": "ਘੰਟਾਵਾਰ ਅਨੁਮਾਨ", "home_week_title": "7-ਦਿਨ ਦਾ ਅਨੁਮਾਨ", "home_lifestyle_title": "ਤੁਹਾਡੇ ਲਈ", "home_alerts_preview_title": "ਸਰਗਰਮ ਚੇਤਾਵਨੀਆਂ", "view_all": "ਸਭ ਦੇਖੋ", "alerts_title": "ਚੇਤਾਵਨੀਆਂ", "alerts_sub": "ਤੁਹਾਡੇ ਖੇਤਰ ਲਈ ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਸਲਾਹ", "tab_all": "ਸਭ", "tab_warnings": "ਚੇਤਾਵਨੀਆਂ", "tab_watches": "ਨਿਗਰਾਨੀ", "tab_advisories": "ਸਲਾਹ", "map_title": "ਨਕਸ਼ਾ ਅਤੇ ਖ਼ਤਰੇ", "layer_radar": "ਰਾਡਾਰ", "layer_lightning": "ਬਿਜਲੀ", "layer_flood": "ਹੜ੍ਹ ਖ਼ਤਰਾ", "layer_wind": "ਹਵਾ", "layer_sos": "SOS ਹੀਟਮੈਪ", "layer_shelters": "ਪਨਾਹਗਾਹਾਂ", "plan_title": "ਯੋਜਨਾ", "plan_sub": "ਮੌਸਮ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਫੈਸਲਿਆਂ ਲਈ ਖਾਸ ਟੂਲ", "tab_travel": "ਯਾਤਰਾ", "tab_agri": "ਖੇਤੀਬਾੜੀ", "tab_fitness": "ਫਿਟਨੈਸ", "tab_event": "ਸਮਾਗਮ", "tab_marine": "ਸਮੁੰਦਰੀ", "climate_title": "ਜਲਵਾਯੂ ਅਤੇ ਖੋਜ", "climate_sub": "ਇਤਿਹਾਸਕ ਰੁਝਾਨ ਅਤੇ ਅਸੰਗਤੀ ਵਿਸ਼ਲੇਸ਼ਣ", "label_metric": "ਮੈਟ੍ਰਿਕ", "label_range": "ਮਿਆਦ", "command_title": "ਕਮਾਂਡ ਕੇਂਦਰ", "command_sub": "ਲਾਈਵ ਖ਼ਤਰਾ, ਘਟਨਾ ਅਤੇ ਸਰੋਤ ਸੰਖੇਪ", "sos_title": "ਐਮਰਜੈਂਸੀ SOS", "sos_sub": "ਨੈੱਟਵਰਕ ਨਾ ਹੋਣ 'ਤੇ ਵੀ ਮੈਸ਼ ਨੈੱਟਵਰਕ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ", "sos_button_label": "SOS ਲਈ ਦਬਾ ਕੇ ਰੱਖੋ", "sos_cancel": "SOS ਰੱਦ ਕਰੋ", "profile_settings_title": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ", "label_full_name": "ਪੂਰਾ ਨਾਮ", "label_home_location": "ਘਰ ਦਾ ਟਿਕਾਣਾ", "label_role_pref": "ਭੂਮਿਕਾ", "label_language": "ਭਾਸ਼ਾ", "label_units": "ਇਕਾਈਆਂ", "label_theme": "ਥੀਮ", "label_accessibility": "ਪਹੁੰਚਯੋਗਤਾ", "label_large_text": "ਵੱਡਾ ਟੈਕਸਟ", "label_high_contrast": "ਉੱਚ ਕੰਟ੍ਰਾਸਟ", "label_reduced_motion": "ਘੱਟ ਐਨੀਮੇਸ਼ਨ", "label_low_data": "ਲੋ-ਡਾਟਾ ਮੋਡ", "label_battery_sos": "ਬੈਟਰੀ-ਸੁਚੇਤ SOS", "label_saved_locations": "ਸੰਭਾਲੇ ਟਿਕਾਣੇ", "btn_add": "ਸ਼ਾਮਲ ਕਰੋ", "btn_logout": "ਲੌਗ ਆਊਟ", "danger_zone_title": "ਖਾਤਾ", "btn_save": "ਸੰਭਾਲੋ", "btn_cancel": "ਰੱਦ ਕਰੋ", "btn_continue": "ਜਾਰੀ ਰੱਖੋ", "btn_back": "ਪਿੱਛੇ", "lang_gate_title": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", "lang_gate_sub": "ਤੁਸੀਂ ਇਸਨੂੰ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸੈਟਿੰਗਾਂ ਤੋਂ ਬਦਲ ਸਕਦੇ ਹੋ।", "lang_gate_continue": "ਜਾਰੀ ਰੱਖੋ", "restricted_note": "ਖੋਜਕਾਰ ਅਤੇ ਅਧਿਕਾਰੀ ਖਾਤਿਆਂ ਲਈ ਉਪਲਬਧ", "restricted_note_command": "ਅਧਿਕਾਰੀ ਖਾਤਿਆਂ ਲਈ ਉਪਲਬਧ"}, "or": {"nav_platform": "ପ୍ଲାଟଫର୍ମ", "nav_intelligence": "ଇଣ୍ଟେଲିଜେନ୍ସ", "nav_personas": "କାହା ପାଇଁ", "nav_login": "ଲଗଇନ୍", "nav_start": "ଆରମ୍ଭ କରନ୍ତୁ", "hero_eyebrow": "ପୂର୍ବାନୁମାନ · ପ୍ରସ୍ତୁତି · ସୁରକ୍ଷା · ପ୍ରତିକ୍ରିୟା", "hero_title_1": "ପାଣିପାଗ କହିବାକୁ ବହୁତ କିଛି ଅଛି।", "hero_title_2": "WeatherGPT ଆପଣଙ୍କୁ କହେ ଏହାର ଅର୍ଥ ଆପଣଙ୍କ ପାଇଁ କଣ।", "hero_sub": "ରାଡାର, ଉପଗ୍ରହ, ବିଜୁଳି, ଜଳବିଜ୍ଞାନ ଏବଂ ଜରୁରୀକାଳୀନ ତଥ୍ୟ ଉପରେ ଏକ କଥୋପକଥନ ଇଣ୍ଟେଲିଜେନ୍ସ ସ୍ତର — ଯାହା କଞ୍ଚା ପାଣିପାଗ ତଥ୍ୟକୁ ନାଗରିକ, କୃଷକ, ଯାତ୍ରୀ, ଗବେଷକ ଏବଂ ବିପର୍ଯ୍ୟୟ କମାଣ୍ଡ କେନ୍ଦ୍ର ପାଇଁ ସରଳ ଭାଷାରେ ନିଷ୍ପତ୍ତିରେ ପରିଣତ କରେ।", "hero_cta_start": "WeatherGPT ସହିତ ଆରମ୍ଭ କରନ୍ତୁ", "hero_cta_demo": "ଏକ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଖନ୍ତୁ ↓", "hero_trust_1": "ଇଣ୍ଟେଲିଜେନ୍ସ ସ୍ତମ୍ଭ", "hero_trust_2": "ବ୍ୟବହାରକାରୀ ପ୍ରକାର", "hero_trust_3": "ମେଶ୍-ସହନଶୀଳ SOS", "demo_question": "“ଯଦି ମୁଁ 6ଟାରେ ବାହାରେ ତେବେ ଛତା ନେବି କି?”", "demo_answer": "ସନ୍ଧ୍ୟା 5:40 ପରେ ବର୍ଷାର ସମ୍ଭାବନା 68% କୁ ବଢ଼ିଯାଏ — ଛତା ସାଙ୍ଗରେ ରଖନ୍ତୁ ଏବଂ ସବୁଠାରୁ ଭାରୀ ବର୍ଷାରୁ ବଞ୍ଚିବାକୁ 10 ମିନିଟ୍ ଆଗରୁ ବାହାରନ୍ତୁ।", "pillars_title": "ଚାରି ଅବିଚ୍ଛେଦ୍ୟ ସ୍ତମ୍ଭ", "pillars_sub": "WeatherGPT ର ପ୍ରତ୍ୟେକ ବିଶେଷତା ଏଥିମଧ୍ୟରୁ ଗୋଟିଏରେ ଅଛି — ଜଣେ ନାଗରିକଙ୍କ ଛତା ପ୍ରଶ୍ନରୁ କମାଣ୍ଡ କେନ୍ଦ୍ରର ଉଦ୍ଧାର ପଥ ପର୍ଯ୍ୟନ୍ତ।", "pillar_weather_title": "ପାଣିପାଗ ଇଣ୍ଟେଲିଜେନ୍ସ", "pillar_predictive_title": "ପୂର୍ବାନୁମାନ ଇଣ୍ଟେଲିଜେନ୍ସ", "pillar_impact_title": "ପ୍ରଭାବ ଇଣ୍ଟେଲିଜେନ୍ସ", "pillar_response_title": "ପ୍ରତିକ୍ରିୟା ଇଣ୍ଟେଲିଜେନ୍ସ", "features_title": "ଆପଣ କିପରି ନିଷ୍ପତ୍ତି ନିଅନ୍ତି ତାହା ଅନୁସାରେ ତିଆରି", "features_sub": "ଆଉ ଏକ ପାଣିପାଗ ଆପ୍ ନୁହେଁ — ଏକ ନିଷ୍ପତ୍ତି ସ୍ତର।", "personas_title": "ଆକାଶ ତଳେ ରହୁଥିବା ସମସ୍ତଙ୍କ ପାଇଁ", "footer_tagline": "WeatherGPT — AI-ଆଧାରିତ ପାଣିପାଗ ଏବଂ ବିପର୍ଯ୍ୟୟ ଇଣ୍ଟେଲିଜେନ୍ସ।", "auth_side_title": "ଏକ ଖାତା। ପାଣିପାଗ ସମ୍ବନ୍ଧୀୟ ପ୍ରତ୍ୟେକ ନିଷ୍ପତ୍ତି।", "auth_side_desc": "ବ୍ୟକ୍ତିଗତ ପୂର୍ବାନୁମାନ, ଆପଣଙ୍କ ଭୂମିକା ଅନୁସାରେ ଆଲର୍ଟ ଏବଂ ନେଟୱାର୍କ ନଥିଲେ ମଧ୍ୟ କାମ କରୁଥିବା ଜରୁରୀକାଳୀନ ଉପକରଣଗୁଡ଼ିକୁ ଅନଲକ୍ କରିବାକୁ ଥରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।", "auth_point_1": "ଆପଣଙ୍କ ଜରୁରୀକାଳୀନ ତଥ୍ୟ ଏନକ୍ରିପ୍ଟେଡ୍ ଏବଂ ସୁରକ୍ଷିତ", "auth_point_2": "ଆପଣଙ୍କ ପୂର୍ବାନୁମାନକୁ ବ୍ୟକ୍ତିଗତ କରିବାକୁ ମାତ୍ର ଅବସ୍ଥାନ ବ୍ୟବହୃତ ହୁଏ", "auth_point_3": "ଇଂରାଜୀ ଏବଂ ଆଞ୍ଚଳିକ ଭାଷାରେ ଉପଲବ୍ଧ", "auth_welcome_title": "ପୁନର୍ବାର ସ୍ୱାଗତ", "auth_welcome_sub": "WeatherGPT ଜାରି ରଖିବାକୁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ", "tab_phone": "ଫୋନ୍", "tab_email": "ଇମେଲ୍", "btn_send_otp": "OTP ପଠାନ୍ତୁ", "otp_title": "6-ଅଙ୍କ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ", "otp_sub": "ଆମେ କୋଡ୍ ପଠାଇଛୁ", "btn_verify_otp": "ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଜାରି ରଖନ୍ତୁ", "btn_resend": "ପୁଣି ପଠାନ୍ତୁ", "otp_change_number": "ନମ୍ବର/ଇମେଲ୍ ବଦଳାନ୍ତୁ", "profile_title": "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ସେଟ୍ କରନ୍ତୁ", "profile_sub": "ଏହା WeatherGPT କୁ ଆପଣଙ୍କୁ ଦେଖାଯାଉଥିବା ସୂଚନାକୁ ବ୍ୟକ୍ତିଗତ କରିବାରେ ସାହାଯ୍ୟ କରେ", "label_name": "ଆପଣଙ୍କ ନାମ", "label_location": "ଘର ଅବସ୍ଥାନ", "label_role": "ମୁଁ ମୁଖ୍ୟତଃ…", "role_citizen": "ନାଗରିକ", "role_farmer": "କୃଷକ", "role_traveler": "ଯାତ୍ରୀ", "role_researcher": "ଗବେଷକ", "role_official": "ଅଧିକାରୀ", "btn_finish_profile": "ସେଟଅପ୍ ସମାପ୍ତ କରନ୍ତୁ", "back_to_landing": "ପଛକୁ", "side_home": "ହୋମ୍", "side_chat": "ଚାଟ୍", "side_map": "ମାନଚିତ୍ର ଏବଂ ବିପଦ", "side_alerts": "ଆଲର୍ଟ", "side_plan": "ଯୋଜନା", "side_climate": "ଜଳବାୟୁ ଏବଂ ଗବେଷଣା", "side_command": "କମାଣ୍ଡ କେନ୍ଦ୍ର", "side_sos": "ଜରୁରୀକାଳୀନ SOS", "side_new_chat": "ନୂଆ ଚାଟ୍", "home_today_title": "ଆଜି", "home_hourly_title": "ଘଣ୍ଟାଭିତ୍ତିକ ପୂର୍ବାନୁମାନ", "home_week_title": "7-ଦିନିଆ ପୂର୍ବାନୁମାନ", "home_lifestyle_title": "ଆପଣଙ୍କ ପାଇଁ", "home_alerts_preview_title": "ସକ୍ରିୟ ଆଲର୍ଟ", "view_all": "ସବୁ ଦେଖନ୍ତୁ", "alerts_title": "ଆଲର୍ଟ", "alerts_sub": "ଆପଣଙ୍କ ଅଞ୍ଚଳ ପାଇଁ ସରକାରୀ ଚେତାବନୀ ଏବଂ ପରାମର୍ଶ", "tab_all": "ସବୁ", "tab_warnings": "ଚେତାବନୀ", "tab_watches": "ନିରୀକ୍ଷଣ", "tab_advisories": "ପରାମର୍ଶ", "map_title": "ମାନଚିତ୍ର ଏବଂ ବିପଦ", "layer_radar": "ରାଡାର", "layer_lightning": "ବିଜୁଳି", "layer_flood": "ବନ୍ୟା ବିପଦ", "layer_wind": "ପବନ", "layer_sos": "SOS ହିଟମ୍ୟାପ୍", "layer_shelters": "ଆଶ୍ରୟସ୍ଥଳ", "plan_title": "ଯୋଜନା", "plan_sub": "ପାଣିପାଗ ପ୍ରଭାବିତ ନିଷ୍ପତ୍ତି ପାଇଁ ବିଶେଷ ଉପକରଣ", "tab_travel": "ଯାତ୍ରା", "tab_agri": "କୃଷି", "tab_fitness": "ଫିଟନେସ୍", "tab_event": "କାର୍ଯ୍ୟକ୍ରମ", "tab_marine": "ସାମୁଦ୍ରିକ", "climate_title": "ଜଳବାୟୁ ଏବଂ ଗବେଷଣା", "climate_sub": "ଐତିହାସିକ ଧାରା ଏବଂ ବିସଙ୍ଗତି ବିଶ୍ଳେଷଣ", "label_metric": "ମେଟ୍ରିକ୍", "label_range": "ଅବଧି", "command_title": "କମାଣ୍ଡ କେନ୍ଦ୍ର", "command_sub": "ଲାଇଭ୍ ବିପଦ, ଘଟଣା ଏବଂ ସମ୍ବଳ ସମୀକ୍ଷା", "sos_title": "ଜରୁରୀକାଳୀନ SOS", "sos_sub": "ସିଗନାଲ୍ ନଥିଲେ ମଧ୍ୟ ମେଶ୍ ନେଟୱାର୍କରେ କାମ କରେ", "sos_button_label": "SOS ପାଇଁ ଦବାଇ ରଖନ୍ତୁ", "sos_cancel": "SOS ବାତିଲ୍ କରନ୍ତୁ", "profile_settings_title": "ପ୍ରୋଫାଇଲ୍ ଏବଂ ସେଟିଂସ୍", "label_full_name": "ପୂର୍ଣ୍ଣ ନାମ", "label_home_location": "ଘର ଅବସ୍ଥାନ", "label_role_pref": "ଭୂମିକା", "label_language": "ଭାଷା", "label_units": "ଏକକ", "label_theme": "ଥିମ୍", "label_accessibility": "ଅଭିଗମ୍ୟତା", "label_large_text": "ବଡ଼ ଟେକ୍ସଟ୍", "label_high_contrast": "ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ", "label_reduced_motion": "କମ୍ ଆନିମେସନ୍", "label_low_data": "ଲୋ-ଡାଟା ମୋଡ୍", "label_battery_sos": "ବ୍ୟାଟେରୀ-ସଚେତନ SOS", "label_saved_locations": "ସେଭ୍ ହୋଇଥିବା ସ୍ଥାନ", "btn_add": "ଯୋଡ଼ନ୍ତୁ", "btn_logout": "ଲଗଆଉଟ୍", "danger_zone_title": "ଖାତା", "btn_save": "ସେଭ୍ କରନ୍ତୁ", "btn_cancel": "ବାତିଲ୍ କରନ୍ତୁ", "btn_continue": "ଜାରି ରଖନ୍ତୁ", "btn_back": "ପଛକୁ", "lang_gate_title": "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ", "lang_gate_sub": "ଆପଣ ଏହାକୁ ଯେକୌଣସି ସମୟରେ ସେଟିଂସରୁ ବଦଳାଇ ପାରିବେ।", "lang_gate_continue": "ଜାରି ରଖନ୍ତୁ", "restricted_note": "ଗବେଷକ ଏବଂ ଅଧିକାରୀ ଖାତା ପାଇଁ ଉପଲବ୍ଧ", "restricted_note_command": "ଅଧିକାରୀ ଖାତା ପାଇଁ ଉପଲବ୍ଧ"}, "as": {"nav_platform": "প্লেটফৰ্ম", "nav_intelligence": "ইণ্টেলিজেন্স", "nav_personas": "কাৰ বাবে", "nav_login": "লগ ইন", "nav_start": "আৰম্ভ কৰক", "hero_eyebrow": "পূৰ্বানুমান · সাজু · সুৰক্ষা · প্ৰতিক্ৰিয়া", "hero_title_1": "বতৰৰ কবলৈ বহুত কথা আছে।", "hero_title_2": "WeatherGPT-এ আপোনাক ক'ব ইয়াৰ অৰ্থ আপোনাৰ বাবে কি।", "hero_sub": "ৰাডাৰ, উপগ্ৰহ, বিজুলী, জলবিজ্ঞান আৰু জৰুৰীকালীন তথ্যৰ ওপৰত এক কথোপকথনমূলক ইণ্টেলিজেন্স স্তৰ — যিয়ে কেঁচা বতৰ তথ্যক নাগৰিক, খেতিয়ক, ভ্ৰমণকাৰী, গৱেষক আৰু বিপৰ্যয় কমাণ্ড কেন্দ্ৰৰ বাবে সহজ ভাষাৰ সিদ্ধান্তলৈ ৰূপান্তৰ কৰে।", "hero_cta_start": "WeatherGPT ৰ সৈতে আৰম্ভ কৰক", "hero_cta_demo": "এটা প্ৰশ্নৰ উত্তৰ চাওক ↓", "hero_trust_1": "ইণ্টেলিজেন্স স্তম্ভ", "hero_trust_2": "ব্যৱহাৰকাৰী প্ৰকাৰ", "hero_trust_3": "মেশ-ৰেজিলিয়েণ্ট SOS", "demo_question": "“মই 6 বজাত ওলালে ছাটা লৈ যাম নে?”", "demo_answer": "সন্ধিয়া 5:40 বজাৰ পিছত বৰষুণৰ সম্ভাৱনা 68%লৈ বাঢ়ে — ছাটা লৈ যাওক আৰু আটাইতকৈ বেছি বৰষুণৰ পৰা ৰক্ষা পাবলৈ 10 মিনিট আগতে ওলাওক।", "pillars_title": "চাৰিটা অবিচ্ছেদ্য স্তম্ভ", "pillars_sub": "WeatherGPT ৰ প্ৰতিটো বৈশিষ্ট্য এইবোৰৰ এটাত থাকে — এজন নাগৰিকৰ ছাটাৰ প্ৰশ্নৰ পৰা কমাণ্ড কেন্দ্ৰৰ উদ্ধাৰ পথলৈকে।", "pillar_weather_title": "বতৰ ইণ্টেলিজেন্স", "pillar_predictive_title": "পূৰ্বানুমান ইণ্টেলিজেন্স", "pillar_impact_title": "প্ৰভাৱ ইণ্টেলিজেন্স", "pillar_response_title": "প্ৰতিক্ৰিয়া ইণ্টেলিজেন্স", "features_title": "আপুনি সিদ্ধান্ত লোৱাৰ ধৰণ অনুসৰি তৈয়াৰ", "features_sub": "আন এটা বতৰ এপ্ নহয় — এটা সিদ্ধান্ত স্তৰ।", "personas_title": "আকাশৰ তলত থকা সকলোৰে বাবে", "footer_tagline": "WeatherGPT — AI-আধাৰিত বতৰ আৰু বিপৰ্যয় ইণ্টেলিজেন্স।", "auth_side_title": "এটা একাউণ্ট। বতৰ সম্পৰ্কীয় প্ৰতিটো সিদ্ধান্ত।", "auth_side_desc": "ব্যক্তিগতকৃত পূৰ্বানুমান, আপোনাৰ ভূমিকা অনুসৰি সতৰ্কবাণী আৰু নেটৱৰ্ক নাথাকিলেও কাম কৰা জৰুৰীকালীন সঁজুলি আনলক কৰিবলৈ এবাৰ ছাইন ইন কৰক।", "auth_point_1": "আপোনাৰ জৰুৰীকালীন তথ্য এনক্ৰিপ্টেড আৰু সুৰক্ষিত", "auth_point_2": "আপোনাৰ পূৰ্বানুমান ব্যক্তিগত কৰিবলৈহে অৱস্থান ব্যৱহাৰ কৰা হয়", "auth_point_3": "ইংৰাজী আৰু আঞ্চলিক ভাষাত উপলব্ধ", "auth_welcome_title": "পুনৰ স্বাগতম", "auth_welcome_sub": "WeatherGPT অব্যাহত ৰাখিবলৈ ছাইন ইন কৰক", "tab_phone": "ফোন", "tab_email": "ইমেইল", "btn_send_otp": "OTP পঠিয়াওক", "otp_title": "6-অংকৰ ক'ড দিয়ক", "otp_sub": "আমি ক'ড পঠিয়াইছোঁ", "btn_verify_otp": "সত্যাপন কৰি অব্যাহত ৰাখক", "btn_resend": "পুনৰ পঠিয়াওক", "otp_change_number": "নম্বৰ/ইমেইল সলনি কৰক", "profile_title": "আপোনাৰ প্ৰ'ফাইল ছেট আপ কৰক", "profile_sub": "ই WeatherGPT ক আপোনাক দেখুওৱা তথ্য ব্যক্তিগত কৰাত সহায় কৰে", "label_name": "আপোনাৰ নাম", "label_location": "ঘৰৰ অৱস্থান", "label_role": "মই মূলতঃ…", "role_citizen": "নাগৰিক", "role_farmer": "খেতিয়ক", "role_traveler": "ভ্ৰমণকাৰী", "role_researcher": "গৱেষক", "role_official": "বিষয়া", "btn_finish_profile": "ছেটআপ সম্পূৰ্ণ কৰক", "back_to_landing": "পিছলৈ", "side_home": "হ'ম", "side_chat": "চেট", "side_map": "মানচিত্ৰ আৰু বিপদ", "side_alerts": "সতৰ্কবাণী", "side_plan": "পৰিকল্পনা", "side_climate": "জলবায়ু আৰু গৱেষণা", "side_command": "কমাণ্ড কেন্দ্ৰ", "side_sos": "জৰুৰীকালীন SOS", "side_new_chat": "নতুন চেট", "home_today_title": "আজি", "home_hourly_title": "ঘণ্টা অনুযায়ী পূৰ্বানুমান", "home_week_title": "7-দিনৰ পূৰ্বানুমান", "home_lifestyle_title": "আপোনাৰ বাবে", "home_alerts_preview_title": "সক্ৰিয় সতৰ্কবাণী", "view_all": "সকলো চাওক", "alerts_title": "সতৰ্কবাণী", "alerts_sub": "আপোনাৰ অঞ্চলৰ বাবে চৰকাৰী সতৰ্কবাণী আৰু পৰামৰ্শ", "tab_all": "সকলো", "tab_warnings": "সতৰ্কবাণী", "tab_watches": "নিৰীক্ষণ", "tab_advisories": "পৰামৰ্শ", "map_title": "মানচিত্ৰ আৰু বিপদ", "layer_radar": "ৰাডাৰ", "layer_lightning": "বিজুলী", "layer_flood": "বান বিপদ", "layer_wind": "বতাহ", "layer_sos": "SOS হিটমেপ", "layer_shelters": "আশ্ৰয়স্থল", "plan_title": "পৰিকল্পনা", "plan_sub": "বতৰে প্ৰভাৱিত কৰা সিদ্ধান্তৰ বাবে বিশেষ সঁজুলি", "tab_travel": "ভ্ৰমণ", "tab_agri": "কৃষি", "tab_fitness": "ফিটনেছ", "tab_event": "অনুষ্ঠান", "tab_marine": "সামুদ্ৰিক", "climate_title": "জলবায়ু আৰু গৱেষণা", "climate_sub": "ঐতিহাসিক প্ৰৱণতা আৰু অসংগতি বিশ্লেষণ", "label_metric": "মেট্ৰিক", "label_range": "সময়সীমা", "command_title": "কমাণ্ড কেন্দ্ৰ", "command_sub": "লাইভ বিপদ, ঘটনা আৰু সম্পদৰ পৰ্যালোচনা", "sos_title": "জৰুৰীকালীন SOS", "sos_sub": "চিগনেল নাথাকিলেও মেশ নেটৱৰ্কত কাম কৰে", "sos_button_label": "SOS ৰ বাবে চাপি ৰাখক", "sos_cancel": "SOS বাতিল কৰক", "profile_settings_title": "প্ৰ'ফাইল আৰু ছেটিংছ", "label_full_name": "সম্পূৰ্ণ নাম", "label_home_location": "ঘৰৰ অৱস্থান", "label_role_pref": "ভূমিকা", "label_language": "ভাষা", "label_units": "একক", "label_theme": "থীম", "label_accessibility": "সাধ্যক্ষমতা", "label_large_text": "ডাঙৰ পাঠ", "label_high_contrast": "উচ্চ কণ্ট্ৰাষ্ট", "label_reduced_motion": "কম এনিমেশ্বন", "label_low_data": "লো-ডাটা ম'ড", "label_battery_sos": "বেটাৰী-সচেতন SOS", "label_saved_locations": "সংৰক্ষিত স্থান", "btn_add": "যোগ কৰক", "btn_logout": "লগআউট", "danger_zone_title": "একাউণ্ট", "btn_save": "সংৰক্ষণ কৰক", "btn_cancel": "বাতিল কৰক", "btn_continue": "অব্যাহত ৰাখক", "btn_back": "পিছলৈ", "lang_gate_title": "আপোনাৰ ভাষা বাছনি কৰক", "lang_gate_sub": "আপুনি এইটো যিকোনো সময়তে ছেটিংছৰ পৰা সলনি কৰিব পাৰে।", "lang_gate_continue": "অব্যাহত ৰাখক", "restricted_note": "গৱেষক আৰু বিষয়া একাউণ্টৰ বাবে উপলব্ধ", "restricted_note_command": "বিষয়া একাউণ্টৰ বাবে উপলব্ধ"}, "ur": {"nav_platform": "پلیٹ فارم", "nav_intelligence": "انٹیلی جنس", "nav_personas": "کن کے لیے", "nav_login": "لاگ ان", "nav_start": "شروع کریں", "hero_eyebrow": "پیش گوئی · تیاری · حفاظت · ردعمل", "hero_title_1": "موسم کے پاس کہنے کو بہت کچھ ہے۔", "hero_title_2": "WeatherGPT آپ کو بتاتا ہے کہ اس کا آپ کے لیے کیا مطلب ہے۔", "hero_sub": "ریڈار، سیٹلائٹ، بجلی، ہائیڈرولوجی اور ہنگامی ڈیٹا پر ایک گفتگو پر مبنی انٹیلی جنس پرت — جو خام موسمی ڈیٹا کو شہریوں، کسانوں، مسافروں، محققین اور آفات کمانڈ مراکز کے لیے آسان زبان کے فیصلوں میں بدل دیتی ہے۔", "hero_cta_start": "WeatherGPT کے ساتھ شروع کریں", "hero_cta_demo": "ایک سوال کا جواب دیکھیں ↓", "hero_trust_1": "انٹیلی جنس ستون", "hero_trust_2": "صارف اقسام", "hero_trust_3": "میش-ریزیلینٹ SOS", "demo_question": "“اگر میں 6 بجے نکلوں تو کیا چھتری لے جاؤں؟”", "demo_answer": "شام 5:40 کے بعد بارش کا امکان 68% تک بڑھ جاتا ہے — چھتری ساتھ رکھیں اور سب سے زیادہ بارش سے بچنے کے لیے 10 منٹ پہلے نکلیں۔", "pillars_title": "چار لازم و ملزوم ستون", "pillars_sub": "WeatherGPT کی ہر خصوصیت ان میں سے کسی ایک میں ہے — ایک شہری کے چھتری کے سوال سے لے کر کمانڈ سینٹر کے ریسکیو روٹ تک۔", "pillar_weather_title": "موسمی انٹیلی جنس", "pillar_predictive_title": "پیش گوئی انٹیلی جنس", "pillar_impact_title": "اثر انٹیلی جنس", "pillar_response_title": "ردعمل انٹیلی جنس", "features_title": "آپ کے فیصلہ کرنے کے انداز کے مطابق بنایا گیا", "features_sub": "ایک اور موسمی ایپ نہیں — ایک فیصلہ پرت۔", "personas_title": "آسمان کے نیچے رہنے والے ہر شخص کے لیے", "footer_tagline": "WeatherGPT — AI پر مبنی موسمی اور آفات انٹیلی جنس۔", "auth_side_title": "ایک اکاؤنٹ۔ موسم سے متعلق ہر فیصلہ۔", "auth_side_desc": "ذاتی نوعیت کی پیش گوئیاں، آپ کے کردار کے مطابق الرٹس، اور نیٹ ورک نہ ہونے پر بھی کام کرنے والے ہنگامی ٹولز کو ان لاک کرنے کے لیے ایک بار سائن ان کریں۔", "auth_point_1": "آپ کا ہنگامی ڈیٹا اینکرپٹڈ اور محفوظ ہے", "auth_point_2": "مقام صرف آپ کی پیش گوئی کو ذاتی بنانے کے لیے استعمال ہوتا ہے", "auth_point_3": "انگریزی اور علاقائی زبانوں میں دستیاب", "auth_welcome_title": "دوبارہ خوش آمدید", "auth_welcome_sub": "WeatherGPT جاری رکھنے کے لیے سائن ان کریں", "tab_phone": "فون", "tab_email": "ای میل", "btn_send_otp": "OTP بھیجیں", "otp_title": "6 ہندسوں کا کوڈ درج کریں", "otp_sub": "ہم نے کوڈ بھیجا ہے", "btn_verify_otp": "تصدیق کریں اور جاری رکھیں", "btn_resend": "دوبارہ بھیجیں", "otp_change_number": "نمبر/ای میل تبدیل کریں", "profile_title": "اپنا پروفائل ترتیب دیں", "profile_sub": "یہ WeatherGPT کو آپ کو دکھائی جانے والی معلومات ذاتی بنانے میں مدد کرتا ہے", "label_name": "آپ کا نام", "label_location": "گھر کا مقام", "label_role": "میں بنیادی طور پر ہوں…", "role_citizen": "شہری", "role_farmer": "کسان", "role_traveler": "مسافر", "role_researcher": "محقق", "role_official": "اہلکار", "btn_finish_profile": "سیٹ اپ مکمل کریں", "back_to_landing": "واپس", "side_home": "ہوم", "side_chat": "چیٹ", "side_map": "نقشہ اور خطرات", "side_alerts": "الرٹس", "side_plan": "منصوبہ", "side_climate": "موسمیات اور تحقیق", "side_command": "کمانڈ سینٹر", "side_sos": "ہنگامی SOS", "side_new_chat": "نئی چیٹ", "home_today_title": "آج", "home_hourly_title": "فی گھنٹہ پیش گوئی", "home_week_title": "7 دن کی پیش گوئی", "home_lifestyle_title": "آپ کے لیے", "home_alerts_preview_title": "فعال الرٹس", "view_all": "سب دیکھیں", "alerts_title": "الرٹس", "alerts_sub": "آپ کے علاقے کے لیے سرکاری وارننگز اور مشورے", "tab_all": "سب", "tab_warnings": "وارننگز", "tab_watches": "نگرانی", "tab_advisories": "مشورے", "map_title": "نقشہ اور خطرات", "layer_radar": "ریڈار", "layer_lightning": "بجلی", "layer_flood": "سیلاب کا خطرہ", "layer_wind": "ہوا", "layer_sos": "SOS ہیٹ میپ", "layer_shelters": "پناہ گاہیں", "plan_title": "منصوبہ", "plan_sub": "موسم سے متاثرہ فیصلوں کے لیے خصوصی ٹولز", "tab_travel": "سفر", "tab_agri": "زراعت", "tab_fitness": "فٹنس", "tab_event": "تقریب", "tab_marine": "سمندری", "climate_title": "موسمیات اور تحقیق", "climate_sub": "تاریخی رجحانات اور بے قاعدگی کا تجزیہ", "label_metric": "میٹرک", "label_range": "مدت", "command_title": "کمانڈ سینٹر", "command_sub": "لائیو خطرہ، واقعہ اور وسائل کا جائزہ", "sos_title": "ہنگامی SOS", "sos_sub": "سگنل نہ ہونے پر بھی میش نیٹ ورکس پر کام کرتا ہے", "sos_button_label": "SOS کے لیے دبائے رکھیں", "sos_cancel": "SOS منسوخ کریں", "profile_settings_title": "پروفائل اور ترتیبات", "label_full_name": "پورا نام", "label_home_location": "گھر کا مقام", "label_role_pref": "کردار", "label_language": "زبان", "label_units": "اکائیاں", "label_theme": "تھیم", "label_accessibility": "رسائی", "label_large_text": "بڑا متن", "label_high_contrast": "زیادہ تضاد", "label_reduced_motion": "کم حرکت", "label_low_data": "لو ڈیٹا موڈ", "label_battery_sos": "بیٹری سے آگاہ SOS", "label_saved_locations": "محفوظ شدہ مقامات", "btn_add": "شامل کریں", "btn_logout": "لاگ آؤٹ", "danger_zone_title": "اکاؤنٹ", "btn_save": "محفوظ کریں", "btn_cancel": "منسوخ کریں", "btn_continue": "جاری رکھیں", "btn_back": "واپس", "lang_gate_title": "اپنی زبان منتخب کریں", "lang_gate_sub": "آپ اسے کسی بھی وقت ترتیبات سے تبدیل کر سکتے ہیں۔", "lang_gate_continue": "جاری رکھیں", "restricted_note": "محقق اور اہلکار اکاؤنٹس کے لیے دستیاب", "restricted_note_command": "اہلکار اکاؤنٹس کے لیے دستیاب"}}};


/* ---------- small helpers ---------- */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const el = (tag, cls, html) => { const n=document.createElement(tag); if(cls) n.className=cls; if(html!==undefined) n.innerHTML=html; return n; };
const rand = (min,max) => Math.random()*(max-min)+min;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

/* ---------- theme (applied immediately, before first paint, to avoid a flash) ---------- */
function setTheme(theme){
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  try{ localStorage.setItem('weathergpt_theme', isLight ? 'light' : 'dark'); }catch(e){/* ignore */}
  $$('#themeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
  $$('#quickThemeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
}
(function applySavedTheme(){
  let savedTheme = null;
  try{ savedTheme = localStorage.getItem('weathergpt_theme'); }catch(e){/* ignore */}
  if(savedTheme === 'light') setTheme('light');
})();

function toast(msg, ms=2600){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('show'), ms);
}
/* inline SVG icon helper — renders from the sprite injected in index.html */
function ic(name, cls='icon'){ return `<svg class="${cls}"><use href="#i-${name}"></use></svg>`; }

/* =========================================================
   MOCK DATA LAYER — stands in for the real data-fusion layer
   ========================================================= */
const ICONS = { clear:ic('sun'), pcloud:ic('cloud-sun'), cloud:ic('cloud'), rain:ic('cloud-rain'), storm:ic('cloud-lightning'), fog:ic('cloud-fog'), night:ic('moon') };

const CITIES = {
  "Kolkata, West Bengal": { temp:31, feels:35, hi:33, lo:27, humidity:78, wind:14, rain:62, uv:6, aqi:96, pressure:1006, desc:'Partly cloudy, humid', icon:'pcloud', coastal:true },
  "Mumbai, Maharashtra":  { temp:29, feels:33, hi:31, lo:26, humidity:84, wind:19, rain:71, uv:5, aqi:88, pressure:1004, desc:'Monsoon showers likely', icon:'rain', coastal:true },
  "Delhi, NCR":            { temp:34, feels:37, hi:37, lo:28, humidity:52, wind:11, rain:22, uv:8, aqi:171, pressure:1002, desc:'Hazy sunshine', icon:'cloud', coastal:false },
  "Chennai, Tamil Nadu":   { temp:32, feels:38, hi:34, lo:28, humidity:80, wind:16, rain:44, uv:7, aqi:74, pressure:1005, desc:'Humid, scattered storms', icon:'storm', coastal:true },
  "Bengaluru, Karnataka":  { temp:24, feels:24, hi:26, lo:19, humidity:68, wind:12, rain:38, uv:5, aqi:52, pressure:1010, desc:'Pleasant, light cloud', icon:'pcloud', coastal:false },
  "Mumbai, Maharashtra ":  null
};
delete CITIES["Mumbai, Maharashtra "];

function genHourly(base){
  const hours = [];
  const now = new Date();
  for(let i=0;i<24;i++){
    const t = new Date(now.getTime() + i*3600000);
    const hour = t.getHours();
    const isNight = hour < 6 || hour > 19;
    let icon = base.icon;
    if(isNight) icon = (base.icon==='rain'||base.icon==='storm') ? base.icon : 'night';
    const rainDelta = Math.round(base.rain + Math.sin(i/3)*20 + rand(-8,8));
    hours.push({
      time: i===0 ? 'Now' : t.toLocaleTimeString([], {hour:'numeric'}),
      temp: Math.round(base.temp + Math.sin((i-9)/6)*4 - (isNight?2:0)),
      icon, rain: Math.max(2, Math.min(96, rainDelta))
    });
  }
  return hours;
}
function genDaily(base){
  const names = ['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];
  const icons = ['pcloud','rain','storm','cloud','clear','pcloud','rain'];
  return names.map((n,i)=>({
    name:n, icon: i===0?base.icon:icons[i],
    hi: Math.round(base.hi + rand(-2,2) - i*0.2),
    lo: Math.round(base.lo + rand(-2,2)),
    rain: Math.max(5, Math.round(base.rain + rand(-30,20)))
  }));
}

const ALERTS = [
  { sev:'warning', icon:'cloud-lightning', title:'Heavy Rainfall Warning — South 24 Parganas', body:'Very heavy rainfall (7–11 cm) likely in the next 6 hours with gusty winds up to 50 km/h. Low-lying areas may see waterlogging.', time:'Issued 22 min ago · Valid until 8:00 PM', source:'Regional Meteorological Centre' },
  { sev:'watch', icon:'waves', title:'Flood Watch — Riverside wards 4–9', body:'River level rising due to upstream rainfall. Monitor local advisories; avoid unnecessary travel near the embankment.', time:'Issued 1h 10m ago · Under review', source:'District Disaster Management Authority' },
  { sev:'advisory', icon:'thermometer', title:'Heat & Humidity Advisory', body:'Feels-like temperature may cross 40°C between 12–4 PM. Stay hydrated and limit strenuous outdoor activity.', time:'Issued 3h ago · Valid today', source:'WeatherGPT personalized advisory' },
  { sev:'watch', icon:'zap', title:'Lightning Risk Increasing', body:'Convective cells forming to the southwest, moving northeast at ~18 km/h. Lightning risk rises after 5 PM.', time:'Issued 8 min ago · Nowcast', source:'WeatherGPT nowcasting engine' },
];

const CLIMATE_SERIES = {
  rain:  { label:'Monsoon rainfall (mm)', unit:'mm', base:1450, trend:6, noise:130 },
  temp:  { label:'Average temperature (°C)', unit:'°C', base:26.4, trend:0.035, noise:0.6 },
  extreme:{ label:'Extreme-rain days / yr', unit:'days', base:6, trend:0.12, noise:2.2 }
};

/* =========================================================
   APP STATE
   ========================================================= */
const state = {
  user: { name:'', location:'Kolkata, West Bengal', role:'citizen', phone:'', email:'' },
  unit: 'c',
  lang: 'en',
  savedLocations: ['Kolkata, West Bengal','Mumbai, Maharashtra','Delhi, NCR'],
  chats: [], // {id, title, messages:[{role,text}]}
  activeChatId: null,
  sos: { taps:0, sending:false, sent:false, lifecycleStep:-1 }
};

/* =========================================================
   LANGUAGE ENGINE
   ========================================================= */
function t(key){
  const dict = I18N_DATA.dict[state.lang] || I18N_DATA.dict.en;
  return dict[key] !== undefined ? dict[key] : (I18N_DATA.dict.en[key] || key);
}
function applyLanguage(lang){
  if(!I18N_DATA.dict[lang]) lang = 'en';
  state.lang = lang;
  document.documentElement.lang = lang;
  document.body.dir = (lang === 'ur') ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(elm=>{ elm.textContent = t(elm.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(elm=>{ elm.placeholder = t(elm.dataset.i18nPlaceholder); });
  $$('[data-i18n-aria]').forEach(elm=>{ elm.setAttribute('aria-label', t(elm.dataset.i18nAria)); });
  const langSelect = $('#settingLanguage');
  if(langSelect) langSelect.value = lang;
  const quickLangSelect = $('#quickLanguageSelect');
  if(quickLangSelect) quickLangSelect.value = lang;
  try{ localStorage.setItem('weathergpt_lang', lang); }catch(e){/* ignore */}
}
let langGateOrigin = null;
function openLanguageGate(origin){
  langGateOrigin = origin || null;
  $('#langGateBack').hidden = !langGateOrigin;
  showView('language');
}
function buildLanguageGate(){
  const grid = $('#languageGrid');
  if(!grid) return;
  grid.innerHTML = I18N_DATA.langs.map(l=>`
    <button class="lang-card" data-lang="${l.code}">
      <span class="lang-native">${l.native}</span>
      <span class="lang-english">${l.english}</span>
    </button>`).join('');
  $$('.lang-card', grid).forEach(card=>{
    card.addEventListener('click', ()=>{
      applyLanguage(card.dataset.lang);
      if(langGateOrigin==='app' && state.user.name){ applyUserToChrome(); renderHome(); showView('app'); }
      else{ showView('landing'); }
      langGateOrigin = null;
    });
  });
  $('#langGateBack').addEventListener('click', ()=>{
    showView(langGateOrigin==='app' ? 'app' : 'landing');
    langGateOrigin = null;
  });
}
function buildSettingsLanguageOptions(){
  const sel = $('#settingLanguage');
  if(!sel) return;
  sel.innerHTML = I18N_DATA.langs.map(l=>`<option value="${l.code}">${l.native} — ${l.english}</option>`).join('');
  sel.value = state.lang;
}

function loadState(){
  try{
    const raw = localStorage.getItem('weathergpt_state');
    if(raw){ Object.assign(state, JSON.parse(raw)); }
    const savedLang = localStorage.getItem('weathergpt_lang');
    if(savedLang) state.lang = savedLang;
  }catch(e){/* ignore */}
}
function saveState(){
  try{ localStorage.setItem('weathergpt_state', JSON.stringify({
    user:state.user, unit:state.unit, savedLocations:state.savedLocations, chats:state.chats
  })); }catch(e){/* ignore */}
}

/* =========================================================
   VIEW ROUTING (language / landing / auth / app)
   ========================================================= */
function showView(name){
  ['language','landing','auth','app'].forEach(v=>{
    $('#view-'+v).hidden = (v!==name);
  });
  window.scrollTo(0,0);
}

/* =========================================================
   SPLASH / LOADING SCREEN
   ========================================================= */
function initSplash(onDone){
  const splash = $('#view-splash');
  if(!splash){ onDone(); return; }
  const reduced = document.body.classList.contains('reduced-motion');
  const holdMs = reduced ? 200 : 1100;
  const fadeMs = reduced ? 0 : 450;
  setTimeout(()=>{
    splash.classList.add('splash-fade');
    onDone();
    setTimeout(()=>{ splash.hidden = true; }, fadeMs);
  }, holdMs);
}

/* =========================================================
   AUTH FLOW
   ========================================================= */
let authMode = 'phone';
let resendInterval = null;

function initLandingNav(){
  const hamburger = $('#btnNavHamburger');
  const navLinks = $('#navLinks');
  if(!hamburger || !navLinks) return;

  function setOpen(open){
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.innerHTML = open
      ? '<svg class="icon-md"><use href="#i-x"></use></svg>'
      : '<svg class="icon-md"><use href="#i-menu"></use></svg>';
  }

  hamburger.addEventListener('click', ()=>{
    setOpen(!navLinks.classList.contains('open'));
  });

  $$('#navLinks a').forEach(a=> a.addEventListener('click', ()=> setOpen(false)));

  document.addEventListener('click', (e)=>{
    if(!navLinks.classList.contains('open')) return;
    if(navLinks.contains(e.target) || hamburger.contains(e.target)) return;
    setOpen(false);
  });
}

function initAuth(){
  $('#btnNavLogin').addEventListener('click', ()=>openAuth());
  $('#btnNavStart').addEventListener('click', ()=>openAuth());
  $('#btnHeroStart').addEventListener('click', ()=>openAuth());
  $('#btnHeroDemo').addEventListener('click', ()=>{
    $('#demoStrip').scrollIntoView({behavior: motionOk()?'smooth':'auto', block:'center'});
  });
  $('#backToLanding').addEventListener('click', ()=> showView('landing'));

  $$('#authModeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#authModeSwitch .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      authMode = btn.dataset.mode;
      $('#phoneField').hidden = authMode!=='phone';
      $('#emailField').hidden = authMode!=='email';
    });
  });

  $('#btnSendOtp').addEventListener('click', handleSendOtp);
  $('#backToIdentifier').addEventListener('click', ()=> switchAuthStep('identifier'));
  $('#btnEditDestination').addEventListener('click', ()=> switchAuthStep('identifier'));
  $('#btnVerifyOtp').addEventListener('click', handleVerifyOtp);
  $('#btnResend').addEventListener('click', startResendTimer);

  initOtpBoxes();

  $$('#roleGrid .role-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      $$('#roleGrid .role-card').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
    });
  });
  $('#btnFinishProfile').addEventListener('click', finishProfile);
}

function openAuth(){
  showView('auth');
  switchAuthStep('identifier');
}
function switchAuthStep(step){
  ['identifier','otp','profile'].forEach(s=>{
    $('#step-'+s).hidden = (s!==step);
  });
}

function handleSendOtp(){
  const err = $('#identifierError');
  err.hidden = true;
  if(authMode==='phone'){
    const val = $('#inputPhone').value.trim();
    if(!/^\d{10}$/.test(val)){
      err.textContent = 'Enter a valid 10-digit mobile number.'; err.hidden = false; return;
    }
    state.user.phone = '+91 ' + val.replace(/(\d{5})(\d{5})/, '$1 $2');
    $('#otpDestination').textContent = state.user.phone;
  } else {
    const val = $('#inputEmail').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(val)){
      err.textContent = 'Enter a valid email address.'; err.hidden = false; return;
    }
    state.user.email = val;
    $('#otpDestination').textContent = val;
  }
  switchAuthStep('otp');
  toast('OTP sent (prototype) — enter any 6 digits');
  $$('.otp-box')[0].value=''; $$('.otp-box').forEach(b=>b.value='');
  $$('.otp-box')[0].focus();
  startResendTimer();
}

function initOtpBoxes(){
  const boxes = $$('.otp-box');
  boxes.forEach((box,i)=>{
    box.addEventListener('input', ()=>{
      box.value = box.value.replace(/\D/g,'').slice(0,1);
      if(box.value && boxes[i+1]) boxes[i+1].focus();
      $('#otpError').hidden = true;
    });
    box.addEventListener('keydown', (e)=>{
      if(e.key==='Backspace' && !box.value && boxes[i-1]) boxes[i-1].focus();
    });
    box.addEventListener('paste', (e)=>{
      const text = (e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);
      if(text.length){
        e.preventDefault();
        text.split('').forEach((ch,idx)=>{ if(boxes[idx]) boxes[idx].value=ch; });
        boxes[Math.min(text.length,6)-1].focus();
      }
    });
  });
}

function startResendTimer(){
  clearInterval(resendInterval);
  let t = 30;
  const btn = $('#btnResend'), span = $('#resendTimer');
  btn.disabled = true;
  span.textContent = t;
  resendInterval = setInterval(()=>{
    t--; span.textContent = t;
    if(t<=0){
      clearInterval(resendInterval);
      btn.disabled = false; btn.innerHTML = 'Resend code';
    }
  },1000);
}

function handleVerifyOtp(){
  const boxes = $$('.otp-box');
  const code = boxes.map(b=>b.value).join('');
  if(code.length!==6 || /\D/.test(code)){
    $('#otpError').hidden = false; return;
  }
  toast('Verified ✓');
  switchAuthStep('profile');
  $('#inputName').focus();
}

function finishProfile(){
  const name = $('#inputName').value.trim() || 'Explorer';
  const loc = $('#inputLocation').value.trim() || 'Kolkata, West Bengal';
  const role = $('#roleGrid .role-card.active')?.dataset.role || 'citizen';
  state.user.name = name;
  state.user.location = loc;
  state.user.role = role;
  if(!state.savedLocations.includes(loc)) state.savedLocations.unshift(loc);
  saveState();
  enterApp();
}

function motionOk(){ return !document.body.classList.contains('reduced-motion'); }

/* =========================================================
   APP SHELL — ENTRY
   ========================================================= */
function enterApp(){
  showView('app');
  applyUserToChrome();
  renderHome();
  renderAlerts();
  renderMap();
  renderClimate();
  renderCommand();
  buildLocationPopover();
  gotoView('chat');
  toast(`Welcome, ${state.user.name || 'there'}`);
}

function applyUserToChrome(){
  const initials = (state.user.name||'G').trim().charAt(0).toUpperCase();
  $('#sidebarAvatar').textContent = initials;
  $('#sidebarName').textContent = state.user.name || 'Guest User';
  $('#sidebarLocation').textContent = state.user.location.split(',')[0] + (state.user.location.split(',')[1] ? ', '+state.user.location.split(',')[1].trim().split(' ')[0] : '');
  $('#currentLocationLabel').textContent = state.user.location;
  $('#navCommand').hidden = state.user.role !== 'official';
  $('#navClimate').hidden = !(state.user.role === 'researcher' || state.user.role === 'official');
  $('#settingName').value = state.user.name;
  $('#settingLocation').value = state.user.location;
  $$('#settingRoleGrid .role-card').forEach(c=> c.classList.toggle('active', c.dataset.role===state.user.role));
  const h = new Date().getHours();
  const greetWord = h<12?'Good morning':(h<17?'Good afternoon':'Good evening');
  $('#homeGreeting').textContent = `${greetWord}, ${state.user.name || 'there'}`;
  $('#homeDate').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'});
}

/* =========================================================
   SIDEBAR NAV
   ========================================================= */
function initNav(){
  $$('.side-link[data-view]').forEach(btn=>{
    btn.addEventListener('click', ()=> gotoView(btn.dataset.view));
  });
  $$('[data-goto]').forEach(btn=> btn.addEventListener('click', ()=> gotoView(btn.dataset.goto)));

  $('#btnOpenSidebar').addEventListener('click', ()=> toggleSidebar(true));
  $('#btnCloseSidebar').addEventListener('click', ()=> toggleSidebar(false));
  $('#sidebarScrim').addEventListener('click', ()=> toggleSidebar(false));
  $('#btnMobileSOS').addEventListener('click', ()=> { gotoView('sos'); toggleSidebar(false); });

  $('#btnNewChat').addEventListener('click', startNewChat);
}
function toggleSidebar(open){
  $('#sidebar').classList.toggle('open', open);
  $('#sidebarScrim').classList.toggle('show', open);
}
function gotoView(name){
  $$('.panel').forEach(p=>p.hidden = true);
  $('#panel-'+name).hidden = false;
  $$('.side-link[data-view]').forEach(b=> b.classList.toggle('active', b.dataset.view===name));
  toggleSidebar(false);
  if(name==='chat') $('#chatInput').focus();
}

/* =========================================================
   HOME PANEL
   ========================================================= */
function currentCityData(){
  return CITIES[state.user.location] || CITIES['Kolkata, West Bengal'];
}
function fmtTemp(c){
  if(state.unit==='f') return Math.round(c*9/5+32)+'°';
  return Math.round(c)+'°';
}

function renderHome(){
  const d = currentCityData();
  $('#hwcIcon').innerHTML = ICONS[d.icon];
  $('#hwcTemp').textContent = fmtTemp(d.temp);
  $('#hwcDesc').textContent = d.desc;
  $('#hwcFeels').textContent = fmtTemp(d.feels);
  $('#hwcHigh').textContent = fmtTemp(d.hi);
  $('#hwcLow').textContent = fmtTemp(d.lo);
  $('#hwcHumidity').textContent = d.humidity+'%';
  $('#hwcWind').textContent = d.wind+' km/h';
  $('#hwcRain').textContent = d.rain+'%';
  $('#hwcUv').textContent = d.uv + ' · ' + (d.uv>=8?'Very High':d.uv>=6?'High':d.uv>=3?'Moderate':'Low');
  $('#hwcAqi').textContent = d.aqi + ' · ' + (d.aqi>150?'Unhealthy':d.aqi>100?'Poor':d.aqi>50?'Moderate':'Good');
  $('#hwcPressure').textContent = d.pressure+' hPa';

  const hourly = genHourly(d);
  $('#hourlyStrip').innerHTML = hourly.map(h=>`
    <div class="hour-card">
      <div class="h-time">${h.time}</div>
      <div class="h-icon">${ICONS[h.icon]}</div>
      <div class="h-temp">${fmtTemp(h.temp)}</div>
      <div class="h-rain">${ic('droplet','icon-sm')} ${h.rain}%</div>
    </div>`).join('');

  const daily = genDaily(d);
  const globalHi = Math.max(...daily.map(x=>x.hi)), globalLo = Math.min(...daily.map(x=>x.lo));
  $('#dailyList').innerHTML = daily.map(dd=>{
    const left = ((dd.lo-globalLo)/(globalHi-globalLo+0.001))*100;
    const width = ((dd.hi-dd.lo)/(globalHi-globalLo+0.001))*100;
    return `<div class="day-row">
      <span class="d-name">${dd.name}</span>
      <div class="d-bar-wrap"><div class="d-bar" style="left:${left}%; width:${Math.max(width,8)}%"></div></div>
      <span class="d-icon">${ICONS[dd.icon]}</span>
      <span class="d-temps"><span class="hi">${fmtTemp(dd.hi)}</span> <span class="lo">${fmtTemp(dd.lo)}</span></span>
    </div>`;
  }).join('');

  renderLifestyle(d);
  renderAlertsPreview();
}

function renderLifestyle(d){
  const cards = {
    citizen: [
      {icon:'umbrella', title:'Commute', text:`Rain probability hits ${d.rain}% this evening — carry an umbrella after 5 PM.`},
      {icon:'activity', title:'Air quality', text:`AQI ${d.aqi} (${d.aqi>100?'sensitive groups should limit exertion':'generally acceptable'}) today.`},
      {icon:'footprints', title:'Best outdoor window', text:`6:10–7:20 AM looks calmest — lower heat, low rain chance.`},
      {icon:'users', title:'Family safety', text:`No active lightning risk on the school-commute route right now.`},
    ],
    farmer: [
      {icon:'wheat', title:'Irrigation', text:`Soil moisture adequate — hold irrigation until rain chance drops below 30%.`},
      {icon:'thermometer', title:'Heat stress', text:`Feels-like ${fmtTemp(d.feels)} at midday — schedule fieldwork before 10 AM.`},
      {icon:'wind', title:'Spraying window', text:`Wind at ${d.wind} km/h — acceptable for spraying, recheck after 2 PM.`},
      {icon:'snowflake', title:'Frost risk', text:`No frost risk expected in the next 5 days.`},
    ],
    traveler: [
      {icon:'plane', title:'Destination watch', text:`Add a destination in Plan → Travel to monitor severe weather en route.`},
      {icon:'luggage', title:'Packing', text:`Pack light rainwear — ${d.rain}% rain chance today at your base location.`},
      {icon:'cloud-fog', title:'Visibility', text:`No fog or dust events reported on nearby routes.`},
      {icon:'clock', title:'Delay risk', text:`Low delay risk from weather at this time.`},
    ],
    researcher: [
      {icon:'bar-chart', title:'Anomaly', text:`Rainfall running slightly above the 20-year seasonal average.`},
      {icon:'calculator', title:'Model spread', text:`Ensemble members show moderate agreement for next 48h rainfall.`},
      {icon:'map', title:'Coverage', text:`Radar and satellite coverage nominal across your saved region.`},
      {icon:'folder', title:'Export', text:`Historical dataset ready for export in Climate & Research.`},
    ],
    official: [
      {icon:'landmark', title:'Command view', text:`Open Command Centre for live hazard, incident and resource status.`},
      {icon:'siren', title:'SOS queue', text:`Incidents awaiting triage — check Command Centre for priorities.`},
      {icon:'waves', title:'Flood watch', text:`Riverside wards flagged for monitoring this evening.`},
      {icon:'radio-tower', title:'Network health', text:`Mesh gateways reporting nominal uptime.`},
    ]
  };
  const list = cards[state.user.role] || cards.citizen;
  $('#lifestyleGrid').innerHTML = list.map(c=>`
    <div class="life-card">
      <div class="lc-top"><span class="lc-icon icon-tile">${ic(c.icon,'icon-md')}</span><h5>${c.title}</h5></div>
      <p>${c.text}</p>
    </div>`).join('');
}

function renderAlertsPreview(){
  $('#alertsPreview').innerHTML = ALERTS.slice(0,2).map(a=> alertCardHtml(a)).join('');
}

/* =========================================================
   ALERTS PANEL
   ========================================================= */
function alertCardHtml(a){
  const tileClass = a.sev==='warning' ? 'danger' : a.sev==='watch' ? 'warn' : '';
  return `<div class="alert-card sev-${a.sev}">
    <div class="alert-icon icon-tile ${tileClass}">${ic(a.icon,'icon-md')}</div>
    <div class="alert-body">
      <div class="alert-title">${a.title}</div>
      <p class="muted small">${a.body}</p>
      <div class="alert-meta">${a.time} · ${a.source}</div>
    </div>
    <span class="alert-sev-tag">${a.sev}</span>
  </div>`;
}
function renderAlerts(filter='all'){
  const list = filter==='all' ? ALERTS : ALERTS.filter(a=>a.sev===filter);
  $('#alertList').innerHTML = list.length ? list.map(alertCardHtml).join('') : `<p class="muted">No ${filter} alerts right now.</p>`;
  $('#alertBadge').textContent = ALERTS.filter(a=>a.sev==='warning').length;
}
function initAlertTabs(){
  $$('#alertTabs .tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $$('#alertTabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      renderAlerts(tab.dataset.filter);
    });
  });
}

/* =========================================================
   CHAT ENGINE
   ========================================================= */
function startNewChat(){
  const id = 'c'+Date.now();
  state.chats.unshift({id, title:'New chat', messages:[]});
  state.activeChatId = id;
  saveState();
  renderChatHistory();
  gotoView('chat');
  renderMessages();
}
function renderChatHistory(){
  const wrap = $('#chatHistoryList');
  if(!state.chats.length){ wrap.innerHTML=''; return; }
  wrap.innerHTML = state.chats.slice(0,12).map(c=>`<button class="history-item" data-id="${c.id}">${c.title}</button>`).join('');
  $$('.history-item', wrap).forEach(b=>{
    b.addEventListener('click', ()=>{ state.activeChatId=b.dataset.id; gotoView('chat'); renderMessages(); });
  });
}
function activeChat(){
  if(!state.activeChatId || !state.chats.find(c=>c.id===state.activeChatId)){
    const id='c'+Date.now(); state.chats.unshift({id,title:'New chat',messages:[]}); state.activeChatId=id;
  }
  return state.chats.find(c=>c.id===state.activeChatId);
}
function renderMessages(){
  const chat = activeChat();
  const wrap = $('#chatMessages');
  if(!chat.messages.length){
    wrap.innerHTML=''; wrap.appendChild($('#chatEmpty') || buildChatEmpty());
    $('#chatEmpty').hidden = false;
    return;
  }
  wrap.innerHTML = '';
  chat.messages.forEach(m=> wrap.appendChild(buildMsgNode(m)));
  wrap.scrollTop = wrap.scrollHeight;
}
function buildChatEmpty(){ return $('#chatEmpty'); }

function buildMsgNode(m){
  const row = el('div', 'msg msg-'+m.role);
  const avatar = el('div','msg-avatar', m.role==='user' ? (state.user.name||'G').charAt(0).toUpperCase() : ic('cloud-sun'));
  const bubble = el('div','msg-bubble');
  bubble.innerHTML = m.html || `<p>${escapeHtml(m.text)}</p>`;
  row.appendChild(avatar); row.appendChild(bubble);
  return row;
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function initChat(){
  $$('#suggestionGrid .suggestion-card').forEach(card=>{
    card.addEventListener('click', ()=> sendMessage(card.textContent));
  });
  $('#btnSend').addEventListener('click', ()=> sendMessage($('#chatInput').value));
  const ta = $('#chatInput');
  ta.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(ta.value); }
  });
  ta.addEventListener('input', ()=>{
    ta.style.height='auto';
    ta.style.overflowY = ta.scrollHeight>140 ? 'auto' : 'hidden';
    ta.style.height=Math.min(ta.scrollHeight,140)+'px';
    const emptyEl = $('#chatEmpty');
    if(emptyEl) emptyEl.hidden = ta.value.trim().length>0;
    const disclaimerEl = $('.chat-disclaimer');
    if(disclaimerEl) disclaimerEl.style.display = ta.value.trim().length>0 ? 'none' : '';
  });
  $('#btnVoice').addEventListener('click', ()=> toast('Voice input is available in the mobile app'));
  $('#btnLangChat').addEventListener('click', ()=> openLanguageGate('app'));
}

function sendMessage(text){
  text = (text||'').trim();
  if(!text) return;
  const chat = activeChat();
  if(chat.title==='New chat') chat.title = text.slice(0,42);
  chat.messages.push({role:'user', text});
  $('#chatInput').value=''; $('#chatInput').style.height='auto'; $('#chatInput').style.overflowY='hidden';
  const disclaimerEl = $('.chat-disclaimer');
  if(disclaimerEl) disclaimerEl.style.display = '';
  renderMessages();
  renderChatHistory();
  saveState();

  const wrap = $('#chatMessages');
  const typingRow = el('div','msg msg-bot');
  typingRow.innerHTML = `<div class="msg-avatar">${ic('cloud-sun')}</div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  wrap.appendChild(typingRow); wrap.scrollTop = wrap.scrollHeight;

  setTimeout(()=>{
    typingRow.remove();
    const reply = generateReply(text);
    chat.messages.push({role:'bot', html: reply});
    renderMessages();
    saveState();
  }, 700 + Math.random()*500);
}

function generateReply(q){
  const t = q.toLowerCase();
  const d = currentCityData();
  const cityShort = state.user.location.split(',')[0];

  const miniCard = (icon,temp,meta)=>`<div class="mini-weather-card"><span class="mwc-icon">${icon}</span><div><div class="mwc-temp">${temp}</div><div class="mwc-meta">${meta}</div></div></div>`;

  if(/umbrella|rain|shower/.test(t)){
    return `<p>Rain probability in ${cityShort} climbs to <strong>${d.rain}%</strong> later today, with the heaviest band expected after 5:30 PM.</p><p>I'd carry an umbrella and, if you can, leave 10–15 minutes earlier to stay ahead of the heaviest showers.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), `${d.desc} · ${d.humidity}% humidity`)}`;
  }
  if(/run|jog|exercise|walk|workout|cycl/.test(t)){
    return `<p>For outdoor activity in ${cityShort}, the safest window today is <strong>6:10–7:20 AM</strong> — lower heat, low rain chance, and manageable UV.</p><p>Avoid 12–3 PM: UV index reaches ${d.uv} and feels-like temperature climbs to ${fmtTemp(d.feels)}.</p>`;
  }
  if(/irrigat|crop|farm|field|soil/.test(t)){
    return `<p>Soil moisture looks adequate for now. With a ${d.rain}% rain chance later today, I'd hold off irrigation and re-check tomorrow morning — irrigating now risks waterlogging if the forecast band arrives.</p><p>If you need to spray, wind is currently ${d.wind} km/h — within a workable range before 2 PM.</p>`;
  }
  if(/flood|inundat|water.?log/.test(t)){
    return `<p>Current flood probability for low-lying zones near ${cityShort} is <strong>Moderate</strong> over the next 3 hours, driven by rainfall accumulation and river levels.</p><p>Roads near drainage choke points may see waterlogging first. I'd avoid underpasses and low-lying stretches until the rain band passes. You can see the live extent on the <strong>Map & Hazards</strong> tab.</p>`;
  }
  if(/lightning|thunder|storm/.test(t)){
    return `<p>A convective cell is tracked to the southwest, moving northeast at roughly 18 km/h — lightning risk near you rises after 5 PM.</p><p>If you're outdoors when thunder is audible, move to a solid, enclosed structure and avoid open fields or tall isolated trees.</p>`;
  }
  if(/travel|destination|trip|flight|airport/.test(t)){
    return `<p>Tell me a destination in <strong>Plan → Travel</strong> and I'll check severe-weather risk, visibility and packing suggestions for your dates. In the meantime, ${cityShort} itself shows ${d.desc.toLowerCase()} with a ${d.rain}% rain chance.</p>`;
  }
  if(/aqi|air quality|pollution|pm2\.5|pollen/.test(t)){
    return `<p>Air quality index is currently <strong>${d.aqi}</strong> (${d.aqi>150?'Unhealthy':d.aqi>100?'Poor':d.aqi>50?'Moderate':'Good'}) in ${cityShort}.</p><p>${d.aqi>100?'If you\'re sensitive to air quality, consider limiting prolonged outdoor exertion today.':'Conditions are generally fine for normal outdoor activity.'}</p>`;
  }
  if(/climate|trend|history|historical|20 year|last \d+ years|anomaly/.test(t)){
    return `<p>Over the last 20 years, monsoon rainfall in this district shows a gentle upward trend with more high-intensity rain days. Open <strong>Climate & Research</strong> to explore the interactive chart and export the dataset.</p>`;
  }
  if(/shelter|evacuat|safe place/.test(t)){
    return `<p>The nearest authorized shelters are shown on the <strong>Map & Hazards</strong> layer ("Shelters"). If you're facing an active emergency, please use the <strong>Emergency SOS</strong> button rather than chat.</p>`;
  }
  if(/sos|emergency|help me|rescue/.test(t)){
    return `<p>If this is an active emergency, please go to <strong>Emergency SOS</strong> right now and press the SOS button — it works even with weak connectivity.</p><p>For non-urgent safety questions, I'm happy to help here.</p>`;
  }
  if(/wind|gust/.test(t)){
    return `<p>Current wind near ${cityShort} is <strong>${d.wind} km/h</strong>. No strong-wind warning is active at this time.</p>`;
  }
  if(/temperature|hot|cold|heat/.test(t)){
    return `<p>It's currently <strong>${fmtTemp(d.temp)}</strong> in ${cityShort}, feeling like ${fmtTemp(d.feels)}. Today's range is ${fmtTemp(d.lo)}–${fmtTemp(d.hi)}.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), d.desc)}`;
  }
  if(/hello|hi\b|hey/.test(t)){
    return `<p>Hi ${state.user.name||'there'} — ask me about rain, wind, air quality, farming windows, travel, flood risk or anything else weather-related for ${cityShort}.</p>`;
  }
  return `<p>Here's what I have for ${cityShort} right now: <strong>${d.desc}</strong>, ${fmtTemp(d.temp)} (feels like ${fmtTemp(d.feels)}), ${d.rain}% rain chance, wind ${d.wind} km/h.</p><p>Ask me something more specific — like a time window, a destination, or a hazard — and I'll tailor the answer.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), `${d.humidity}% humidity · AQI ${d.aqi}`)}`;
}

/* =========================================================
   MAP & HAZARDS
   ========================================================= */
const LAYER_INFO = {
  radar: { text:'Radar shows a moderate-to-heavy rain band moving northeast at ~18 km/h, expected to reach central districts within 40 minutes.', legend:[['Light rain','#6d84c2'],['Moderate','#4bacce'],['Heavy','#c98f4e'],['Severe','#c9556a']] },
  lightning: { text:'12 lightning strikes detected in the last 10 minutes, clustered southwest of the city centre. Cell tracked moving northeast.', legend:[['Strike (recent)','#e0c168'],['Strike cluster','#c98f4e']] },
  flood: { text:'Flood probability model flags 3 wards as Moderate–High risk in the next 3 hours based on rainfall, drainage and river-level fusion.', legend:[['Low risk','#45a481'],['Moderate','#c98f4e'],['High','#c9556a']] },
  wind: { text:'Sustained wind 14–19 km/h from the southwest, gusting to 28 km/h near the coast.', legend:[['Calm','#6d84c2'],['Breezy','#4bacce'],['Gusty','#c98f4e']] },
  sos: { text:'2 active SOS incidents in the last hour, both triaged. Heatmap reflects incident density, not individual identities.', legend:[['Low density','#45a481'],['Elevated','#c98f4e'],['Critical cluster','#c9556a']] },
  shelters: { text:'6 authorized shelters within 12 km, 3 at more than 50% capacity. Hospital network status nominal.', legend:[['Shelter (open)','#45a481'],['Shelter (near full)','#c98f4e'],['Hospital','#6d84c2']] }
};
let currentLayer = 'radar';

function renderMap(){
  drawMapLayer(currentLayer);
  $('#mapDetailText').textContent = LAYER_INFO[currentLayer].text;
  $('#mapLegend').innerHTML = LAYER_INFO[currentLayer].legend.map(([label,color])=>
    `<div><span class="legend-dot" style="background:${color}"></span>${label}</div>`).join('');
}
function drawMapLayer(layer){
  const svg = $('#mapSvg');
  svg.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  // base region outline (abstract)
  const outline = document.createElementNS(ns,'path');
  outline.setAttribute('d','M120,80 Q220,40 340,70 T560,60 Q680,90 700,180 Q720,280 620,340 Q540,400 400,390 Q260,410 180,340 Q90,270 100,180 Q100,120 120,80 Z');
  outline.setAttribute('fill','rgba(109,132,194,.05)');
  outline.setAttribute('stroke','rgba(109,132,194,.22)');
  outline.setAttribute('stroke-width','1.5');
  svg.appendChild(outline);

  const seedPositions = [[260,150],[340,220],[420,150],[500,260],[300,300],[460,340],[560,180],[220,260]];
  const colors = LAYER_INFO[layer].legend.map(l=>l[1]);
  seedPositions.forEach((p,i)=>{
    const c = document.createElementNS(ns,'circle');
    const r = 26 + (i%3)*18;
    c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]); c.setAttribute('r',r);
    c.setAttribute('fill', colors[i%colors.length]);
    c.setAttribute('opacity', 0.16 + (i%3)*0.06);
    svg.appendChild(c);
  });
  seedPositions.slice(0, layer==='sos'?2: layer==='shelters'?6:4).forEach((p,i)=>{
    const dot = document.createElementNS(ns,'circle');
    dot.setAttribute('cx',p[0]+rand(-10,10)); dot.setAttribute('cy',p[1]+rand(-10,10)); dot.setAttribute('r', layer==='shelters'?6:5);
    dot.setAttribute('fill', colors[(i+1)%colors.length]);
    dot.setAttribute('stroke','#0a0d13'); dot.setAttribute('stroke-width','1.5');
    svg.appendChild(dot);
  });
  // "you are here" marker
  const you = document.createElementNS(ns,'g');
  you.innerHTML = `<circle cx="400" cy="230" r="7" fill="#4bacce" stroke="#0a0d13" stroke-width="2"/><circle cx="400" cy="230" r="14" fill="none" stroke="#4bacce" stroke-width="1.5" opacity=".6"/>`;
  svg.appendChild(you);
}
function initMap(){
  $$('#mapToolbar .layer-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      $$('#mapToolbar .layer-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      currentLayer = chip.dataset.layer;
      renderMap();
    });
  });
  $('#mapTimeRange').addEventListener('input', (e)=>{
    const v = +e.target.value;
    const label = v<3 ? `Observed ${3-v}h ago` : v===3 ? 'Now' : `Forecast +${v-3}h`;
    $('#mapDetailText').textContent = `[${label}] ` + LAYER_INFO[currentLayer].text;
  });
}

/* =========================================================
   PLAN TOOLS
   ========================================================= */
function initPlan(){
  $$('#toolTabs .tool-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $$('#toolTabs .tool-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      $$('.tool-panel').forEach(p=>p.hidden=true);
      $('#tool-'+tab.dataset.tool).hidden=false;
    });
  });

  const todayStr = new Date().toISOString().slice(0,10);
  if($('#eventDate')) $('#eventDate').value = todayStr;
  if($('#travelDate')) $('#travelDate').value = todayStr;

  $('#btnCheckTravel').addEventListener('click', ()=>{
    const dest = $('#travelDest').value.trim() || 'your destination';
    const data = CITIES[Object.keys(CITIES).find(c=>c.toLowerCase().includes(dest.toLowerCase()))] || pick(Object.values(CITIES));
    const box = $('#travelResult');
    box.classList.add('show');
    box.innerHTML = `<div class="result-card">
      <h4>${ICONS[data.icon]} ${dest}</h4>
      <p>${data.desc}, ${fmtTemp(data.temp)} (feels like ${fmtTemp(data.feels)}). Rain chance ${data.rain}%, wind ${data.wind} km/h.</p>
      <p>${data.rain>55 ? 'Pack rainwear and build buffer time into transfers.' : 'Conditions look manageable — pack light layers.'}</p>
      <div class="result-tags">
        <span class="result-tag ${data.rain>55?'warn':'good'}">${data.rain>55?'Rain likely':'Low rain risk'}</span>
        <span class="result-tag ${data.aqi>100?'warn':'good'}">AQI ${data.aqi}</span>
        <span class="result-tag good">No severe-weather advisory</span>
      </div>
    </div>`;
  });

  $('#btnCheckAgri').addEventListener('click', ()=>{
    const crop = $('#agriCrop').value; const loc = $('#agriLoc').value.trim();
    const d = currentCityData();
    const box = $('#agriResult'); box.classList.add('show');
    const irrigate = d.rain < 35;
    box.innerHTML = `<div class="result-card">
      <h4>${ic('wheat')} ${crop} — ${loc}</h4>
      <p>${irrigate ? `Rain chance is only ${d.rain}% — irrigate this morning while soil moisture is manageable.` : `Rain chance is ${d.rain}% — hold irrigation; natural rainfall should cover today's needs.`}</p>
      <p>Wind ${d.wind} km/h is ${d.wind<20?'within a safe spraying range':'a bit high for spraying — recheck later'}. No frost risk in the 5-day outlook.</p>
      <div class="result-tags">
        <span class="result-tag ${irrigate?'good':'warn'}">${irrigate?'Irrigate today':'Hold irrigation'}</span>
        <span class="result-tag good">No frost risk</span>
        <span class="result-tag ${d.wind<20?'good':'warn'}">Spraying ${d.wind<20?'OK':'marginal'}</span>
      </div>
    </div>`;
  });

  $('#btnCheckFitness').addEventListener('click', ()=>{
    const act = $('#fitnessActivity').value;
    const box = $('#fitnessResult'); box.classList.add('show');
    box.innerHTML = `<div class="result-card">
      <h4>${ic('footprints')} Best window for ${act}</h4>
      <p><strong>6:10 – 7:20 AM</strong> is safest today — cooler temperatures, low UV, and rain chance under 15%.</p>
      <p>Avoid 12:00–3:30 PM: UV index and heat stress both peak in that window.</p>
      <div class="result-tags">
        <span class="result-tag good">6:10–7:20 AM: Safe</span>
        <span class="result-tag warn">5:30–7:00 PM: Caution — humidity high</span>
        <span class="result-tag bad">12:00–3:30 PM: Avoid</span>
      </div>
    </div>`;
  });

  $('#btnCheckEvent').addEventListener('click', ()=> renderEventPlan());

  $('#btnCheckMarine').addEventListener('click', ()=>{
    const loc = $('#marineLoc').value.trim();
    const box = $('#marineResult'); box.classList.add('show');
    const wave = (rand(0.6,2.2)).toFixed(1);
    const safe = wave < 1.6;
    box.innerHTML = `<div class="result-card">
      <h4>${ic('waves')} ${loc}</h4>
      <p>Wave height ~${wave} m, wind onshore at ${Math.round(rand(10,26))} km/h. Tide: next high tide in ${Math.round(rand(1,6))}h.</p>
      <p>${safe ? 'Conditions are within a generally safe range for swimming close to shore — still watch for rip currents.' : 'Elevated wave height — exercise caution, and check local lifeguard flags before entering the water.'}</p>
      <div class="result-tags">
        <span class="result-tag ${safe?'good':'warn'}">${safe?'Safe window':'Use caution'}</span>
        <span class="result-tag good">No storm warning active</span>
      </div>
    </div>`;
  });
}

/* =========================================================
   EVENT PLANNER — deterministic per-date/location forecasting,
   risk scoring and a tailored preparation checklist
   ========================================================= */
const EVENT_TYPE_ICON = {
  'Wedding':'party-popper', 'Birthday party':'party-popper', 'Corporate event':'building-2',
  'Concert / festival':'radio', 'Sports event':'activity', 'Religious / cultural':'landmark', 'Other':'party-popper'
};

function seededRandom(seedStr){
  let h = 0;
  for(let i=0;i<seedStr.length;i++){ h = (Math.imul(31,h) + seedStr.charCodeAt(i)) | 0; }
  return function(){
    h = Math.imul(h ^ (h>>>15), 1 | h);
    h ^= h + Math.imul(h ^ (h>>>7), 61 | h);
    return ((h ^ (h>>>14)) >>> 0) / 4294967296;
  };
}
function findCity(loc){
  const key = Object.keys(CITIES).find(c=>c.toLowerCase().includes((loc||'').toLowerCase()));
  return CITIES[key] || currentCityData();
}
function weatherForDate(loc, dateStr){
  const base = findCity(loc);
  const rnd = seededRandom(loc + '|' + dateStr);
  const rainDelta = Math.round(rnd()*45) - 16;
  const windDelta = Math.round(rnd()*10) - 4;
  const tempDelta = Math.round(rnd()*4) - 2;
  return {
    temp: base.temp + tempDelta,
    rain: Math.min(95, Math.max(4, base.rain + rainDelta)),
    wind: Math.max(4, base.wind + windDelta),
    icon: base.icon,
    desc: base.desc
  };
}
function computeEventRisk(w, venue, guests){
  let score = 0;
  if(venue !== 'indoor'){
    if(w.rain > 60) score += 3; else if(w.rain > 35) score += 2; else if(w.rain > 15) score += 1;
    if(w.wind > 30) score += 2; else if(w.wind > 22) score += 1;
    if(venue === 'outdoor-open') score += 1;
  }
  if(guests > 300) score += 1;
  if(score >= 4) return 'high';
  if(score >= 2) return 'moderate';
  return 'low';
}
function buildEventChecklist({type, venue, guests, w, backup}){
  const items = [];
  const push = (icon, tone, text) => items.push({icon, tone, text});

  if(venue !== 'indoor'){
    if(w.rain > 35){
      push('cloud-lightning','warn', `Rain probability is ${w.rain}% — arrange tenting or a covered area for at least the main seating zone.`);
      if(!backup) push('triangle-alert','bad', `No backup indoor venue on file — consider booking one, or set a clear go/no-go decision time 24h out.`);
    } else {
      push('check','good', `Rain probability is low (${w.rain}%) — an open-air setup should be comfortable.`);
    }
    if(w.wind > 22){
      push('wind','warn', `Wind expected around ${w.wind} km/h — secure canopies, signage, lightweight decor and any hanging structures.`);
    }
    if(venue === 'outdoor-open'){
      push('sun','warn', `No overhead cover — plan shaded seating and keep ponchos or umbrellas on standby for guests.`);
    }
  } else {
    push('check','good', `Indoor venue — weather has minimal effect on the event itself. Confirm the venue's backup power and entrance drainage.`);
  }

  if(guests > 250){
    push('users','warn', `${guests} expected guests is a large crowd — plan a first-aid/cooling station and clear crowd-flow paths.`);
  }
  if(w.temp >= 32 && venue !== 'indoor'){
    push('thermometer','warn', `Expected temperature ${w.temp}°C — arrange drinking water, shaded rest areas and misting fans.`);
  }
  if(type === 'Concert / festival' || type === 'Sports event'){
    push('radio-tower','warn', `Weatherproof sound/AV equipment, and set a lightning-safety pause protocol with the crew.`);
  }
  if(type === 'Wedding' || type === 'Religious / cultural'){
    push('umbrella','good', `Keep a few umbrellas and a small canopy near the entrance for guest arrival, regardless of forecast.`);
  }
  if(type === 'Corporate event'){
    push('zap','good', `Confirm backup power for AV and electronics, especially for any outdoor component.`);
  }
  push('clock','good', `Re-check this forecast again 24 hours before the event — conditions can shift.`);
  return items;
}
function renderEventPlan(){
  const name = $('#eventName').value.trim() || 'Your event';
  const type = $('#eventType').value;
  const venue = $('#eventVenue').value;
  const loc = $('#eventLoc').value.trim() || state.user.location;
  const dateVal = $('#eventDate').value || new Date().toISOString().slice(0,10);
  const time = $('#eventTime').value || '18:00';
  const guests = Math.max(1, parseInt($('#eventGuests').value,10) || 1);
  const backup = $('#eventBackup').checked;

  const w = weatherForDate(loc, dateVal);
  const risk = computeEventRisk(w, venue, guests);
  const checklist = buildEventChecklist({type, venue, guests, w, backup});

  const eventDate = new Date(dateVal + 'T' + time);
  const dateLabel = isNaN(eventDate) ? dateVal : eventDate.toLocaleDateString(undefined, {weekday:'short', day:'numeric', month:'short'}) + ' · ' + time;

  // ±1 day comparison
  const dayMs = 86400000;
  const base = new Date(dateVal + 'T00:00:00');
  const days = [-1,0,1].map(off=>{
    const d = new Date(base.getTime() + off*dayMs);
    const ds = d.toISOString().slice(0,10);
    const dw = weatherForDate(loc, ds);
    return { offset:off, date:d, weather:dw, riskScore: venue!=='indoor' ? dw.rain + dw.wind*0.5 : 0 };
  });
  const bestOffset = venue==='indoor' ? 0 : days.slice().sort((a,b)=>a.riskScore-b.riskScore)[0].offset;

  const riskLabel = { low:'Low risk', moderate:'Moderate risk', high:'High risk' }[risk];

  const box = $('#eventResult');
  box.classList.add('show');
  box.innerHTML = `
    <div class="result-card">
      <div class="event-summary">
        <div class="event-summary-main">
          <span class="icon-tile lg">${ic(EVENT_TYPE_ICON[type] || 'party-popper','icon-lg')}</span>
          <div>
            <h4>${name}</h4>
            <div class="event-when">${type} · ${dateLabel} · ${loc}</div>
          </div>
        </div>
        <span class="risk-badge ${risk}">${riskLabel}</span>
      </div>

      <div class="event-weather-row">
        <div><small>Condition</small><strong>${w.desc}</strong></div>
        <div><small>Temp</small><strong>${fmtTemp(w.temp)}</strong></div>
        <div><small>Rain chance</small><strong>${w.rain}%</strong></div>
        <div><small>Wind</small><strong>${w.wind} km/h</strong></div>
      </div>

      <div class="event-section-label">Preparation checklist</div>
      <ul class="checklist">
        ${checklist.map(c=>`<li><span class="icon-tile ${c.tone==='bad'?'danger':c.tone==='warn'?'warn':'safe'}">${ic(c.icon)}</span><span>${c.text}</span></li>`).join('')}
      </ul>

      <div class="event-section-label">If your date is flexible</div>
      <div class="day-compare">
        ${days.map(d=>{
          const isBest = d.offset===bestOffset;
          const label = d.offset===0 ? 'Your date' : d.date.toLocaleDateString(undefined,{weekday:'short', day:'numeric', month:'short'});
          return `<div class="day-compare-card ${isBest?'best':''}">
            ${isBest?'<span class="dc-best-tag">Best</span>':''}
            <div class="dc-label">${label}</div>
            <div class="dc-icon">${ic(d.weather.icon,'icon-md')}</div>
            <div class="dc-temp">${fmtTemp(d.weather.temp)}</div>
            <div class="dc-rain">${d.weather.rain}% rain</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* =========================================================
   CLIMATE / RESEARCH — canvas chart
   ========================================================= */
function renderClimate(){
  const metricKey = $('#climateMetric').value;
  const years = +$('#climateRange').value;
  const series = CLIMATE_SERIES[metricKey];
  const data = [];
  for(let i=years-1;i>=0;i--){
    const val = series.base + series.trend*(years-1-i) + (Math.sin(i*0.7)*series.noise*0.5) + rand(-series.noise,series.noise)*0.5;
    data.push(Math.max(0,val));
  }
  drawChart(data, series);

  const avg = data.reduce((a,b)=>a+b,0)/data.length;
  const first = data[0], last = data[data.length-1];
  const changePct = (((last-first)/Math.max(first,0.001))*100).toFixed(1);
  $('#climateStats').innerHTML = `
    <div class="climate-stat"><strong>${avg.toFixed(1)}</strong><span>${years}-yr average (${series.unit})</span></div>
    <div class="climate-stat"><strong>${changePct>0?'+':''}${changePct}%</strong><span>Change vs. ${years} yrs ago</span></div>
    <div class="climate-stat"><strong>${Math.max(...data).toFixed(1)}</strong><span>Peak value</span></div>
    <div class="climate-stat"><strong>${Math.min(...data).toFixed(1)}</strong><span>Lowest value</span></div>`;
}
function drawChart(data, series){
  const canvas = $('#climateChart');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.parentElement.clientWidth - 48;
  const h = 260;
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height=h+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);

  const pad = {l:40,r:16,t:16,b:26};
  const max = Math.max(...data)*1.12, min = Math.min(...data)*0.9;
  const xStep = (w-pad.l-pad.r)/(data.length-1);
  const yFor = v => h-pad.b - ((v-min)/(max-min||1))*(h-pad.t-pad.b);

  // gridlines
  ctx.strokeStyle = 'rgba(109,132,194,.12)'; ctx.lineWidth=1;
  ctx.fillStyle = 'rgba(154,168,199,.8)'; ctx.font='11px IBM Plex Mono, monospace';
  for(let i=0;i<=4;i++){
    const y = pad.t + (h-pad.t-pad.b)*i/4;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    const val = max - (max-min)*i/4;
    ctx.fillText(val.toFixed(0), 4, y+3);
  }

  // area fill
  const grad = ctx.createLinearGradient(0,pad.t,0,h-pad.b);
  grad.addColorStop(0,'rgba(75,172,206,.28)'); grad.addColorStop(1,'rgba(75,172,206,0)');
  ctx.beginPath();
  data.forEach((v,i)=>{ const x=pad.l+i*xStep, y=yFor(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.lineTo(pad.l+(data.length-1)*xStep, h-pad.b); ctx.lineTo(pad.l,h-pad.b); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // line
  ctx.beginPath();
  data.forEach((v,i)=>{ const x=pad.l+i*xStep, y=yFor(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.strokeStyle = '#4bacce'; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.stroke();

  // trend line (dashed)
  ctx.setLineDash([4,4]);
  ctx.beginPath();
  ctx.moveTo(pad.l, yFor(data[0]));
  ctx.lineTo(pad.l+(data.length-1)*xStep, yFor(data[data.length-1]));
  ctx.strokeStyle = 'rgba(201,143,78,.7)'; ctx.lineWidth=1.4; ctx.stroke();
  ctx.setLineDash([]);
}
function initClimate(){
  $('#climateMetric').addEventListener('change', renderClimate);
  $('#climateRange').addEventListener('change', renderClimate);
  window.addEventListener('resize', debounce(()=>{ if(!$('#panel-climate').hidden) renderClimate(); }, 200));
}
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

/* =========================================================
   COMMAND CENTRE
   ========================================================= */
const INCIDENTS = [
  {p:'critical', name:'SOS #4821', meta:'Zone 7 · No cellular · mesh relay', action:'Dispatch'},
  {p:'high', name:'SOS #4819', meta:'Riverside Ward 4 · weak signal', action:'Assign'},
  {p:'medium', name:'Damage report #211', meta:'Road blockage, MG Road', action:'Review'},
  {p:'high', name:'SOS #4823', meta:'Coastal sector · battery low', action:'Assign'},
  {p:'medium', name:'Damage report #212', meta:'Power outage reported, Sector 5', action:'Review'},
];
const RESOURCES = [
  {name:'Ambulances available', status:'14 / 20', low:false},
  {name:'Boats ready', status:'3 / 6', low:true},
  {name:'Shelters open', status:'6 / 8', low:false},
  {name:'Responders on duty', status:'42 / 50', low:false},
];
const UNDERSERVED = ['Ward 9 — shelter capacity below demand','Riverside sector C — road accessibility limited','North colony — 1 responder per 4,200 residents'];

function renderCommand(){
  $('#commandStats').innerHTML = `
    <div class="cstat"><strong>${INCIDENTS.length}</strong><span>Open incidents</span></div>
    <div class="cstat"><strong>3</strong><span>Active hazard zones</span></div>
    <div class="cstat"><strong>92%</strong><span>Mesh gateway uptime</span></div>
    <div class="cstat"><strong>68%</strong><span>Shelter capacity used</span></div>`;
  $('#incidentCount').textContent = `(${INCIDENTS.length})`;
  $('#incidentQueue').innerHTML = INCIDENTS.map(i=>`
    <div class="incident-row">
      <div class="incident-priority p-${i.p}"></div>
      <div class="incident-info"><strong>${i.name}</strong><small>${i.meta}</small></div>
      <button class="incident-action">${i.action}</button>
    </div>`).join('');
  $('#resourceStatus').innerHTML = RESOURCES.map(r=>`
    <div class="resource-row"><span>${r.name}</span><span class="r-status ${r.low?'low':''}">${r.status}</span></div>`).join('');
  $('#underservedList').innerHTML = UNDERSERVED.map(u=>`<div class="underserved-row"><span>${u}</span>${ic('triangle-alert','icon icon-sm')}</div>`).join('');

  $$('.incident-action').forEach(btn=> btn.addEventListener('click', ()=> toast(`${btn.previousElementSibling.querySelector('strong').textContent} → action logged`)));
}

/* =========================================================
   SOS
   ========================================================= */
const SOS_STEPS = ['Triggered','Queued locally','Direct delivery attempted','Mesh discovery','Relayed via nearby device','Gateway received','Server acknowledged','Responder assigned'];
let sosTapTimer = null, sosCancelTimer = null, sosCountdownVal = 5;

function initSos(){
  $('#sosButton').addEventListener('click', handleSosTap);
  $('#btnCancelSos').addEventListener('click', cancelSos);
  $('#btnResolveSos').addEventListener('click', resolveSos);
}
function urgencyFromTaps(n){
  if(n>=6) return {label:'CRITICAL', cls:'bad'};
  if(n>=3) return {label:'HIGH', cls:'warn'};
  if(n>=1) return {label:'STANDARD', cls:''};
  return {label:'—', cls:''};
}
function handleSosTap(){
  if(state.sos.sending || state.sos.sent) return;
  state.sos.taps++;
  $('#sosTapCount').textContent = state.sos.taps;
  const u = urgencyFromTaps(state.sos.taps);
  const tag = $('#sosUrgencyLabel');
  tag.textContent = u.label;
  tag.style.color = u.cls==='bad' ? 'var(--danger)' : u.cls==='warn' ? 'var(--warn)' : 'var(--text-dim)';

  clearTimeout(sosTapTimer);
  sosTapTimer = setTimeout(()=> beginSosCountdown(), 1100);
}
function beginSosCountdown(){
  if(state.sos.sending || state.sos.sent) return;
  state.sos.sending = true;
  $('#sosCancelRow').hidden = false;
  sosCountdownVal = 5;
  $('#sosCountdown').textContent = sosCountdownVal;
  sosCancelTimer = setInterval(()=>{
    sosCountdownVal--;
    $('#sosCountdown').textContent = Math.max(sosCountdownVal,0);
    if(sosCountdownVal<=0){
      clearInterval(sosCancelTimer);
      dispatchSos();
    }
  },1000);
}
function cancelSos(){
  clearInterval(sosCancelTimer);
  state.sos = {taps:0, sending:false, sent:false, lifecycleStep:-1};
  $('#sosCancelRow').hidden = true;
  $('#sosTapCount').textContent = '0';
  $('#sosUrgencyLabel').textContent = '—';
  $('#sosStatus').hidden = true;
  toast('SOS cancelled');
}
function dispatchSos(){
  state.sos.sending = false;
  state.sos.sent = true;
  $('#sosCancelRow').hidden = true;
  $('#sosStatus').hidden = false;
  $('#sosLifecycle').innerHTML = SOS_STEPS.map(s=>`<li>${s}</li>`).join('');
  const battery = pick(['High (82%)','Medium (46%)','Low (18%)']);
  $('#ctxBattery').textContent = battery;
  $('#ctxConn').textContent = pick(['Direct (weak)','Mesh only','Direct (stable)']);
  $('#ctxHops').textContent = Math.floor(rand(1,4))+' nearby devices';
  $('#ctxLoc').textContent = state.user.location.split(',')[0] + ' · approx.';
  toast('SOS transmitted — tracking status');
  progressLifecycle(0);
}
function progressLifecycle(i){
  const items = $$('#sosLifecycle li');
  if(i>0) items[i-1].classList.replace('active','done');
  if(i>=items.length) return;
  items[i].classList.add('active');
  setTimeout(()=> progressLifecycle(i+1), 1400);
}
function resolveSos(){
  state.sos = {taps:0, sending:false, sent:false, lifecycleStep:-1};
  $('#sosStatus').hidden = true;
  $('#sosTapCount').textContent = '0';
  $('#sosUrgencyLabel').textContent = '—';
  toast('Marked as resolved. Stay safe.');
}

/* =========================================================
   LOCATION SWITCHER
   ========================================================= */
function buildLocationPopover(){
  const list = $('#locationPopoverList');
  list.innerHTML = state.savedLocations.map(loc=>`<button class="loc-item" data-loc="${loc}">${ic('map-pin','icon icon-sm')} ${loc}</button>`).join('');
  $$('.loc-item', list).forEach(b=>{
    b.addEventListener('click', ()=>{
      state.user.location = b.dataset.loc;
      $('#locationPopover').hidden = true;
      applyUserToChrome(); renderHome(); saveState();
      toast('Location switched to '+b.dataset.loc.split(',')[0]);
    });
  });
}
function initLocationSwitch(){
  $('#btnLocationSwitch').addEventListener('click', (e)=>{
    const pop = $('#locationPopover');
    const btnRect = e.currentTarget.getBoundingClientRect();
    pop.style.top = (btnRect.bottom+8)+'px';
    pop.style.left = Math.min(btnRect.left, window.innerWidth-260)+'px';
    pop.hidden = !pop.hidden;
  });
  document.addEventListener('click', (e)=>{
    const pop = $('#locationPopover');
    if(!pop.hidden && !pop.contains(e.target) && e.target.id!=='btnLocationSwitch' && !e.target.closest('#btnLocationSwitch')){
      pop.hidden = true;
    }
  });
}

/* =========================================================
   QUICK SETTINGS POPOVER (theme / language / logout)
   ========================================================= */
function initQuickSettings(){
  const popover = $('#settingsPopover');
  const triggers = $$('.js-settings-trigger');
  if(!popover || !triggers.length) return;

  const quickLangSelect = $('#quickLanguageSelect');
  if(quickLangSelect){
    quickLangSelect.innerHTML = I18N_DATA.langs.map(l=>`<option value="${l.code}">${l.native} — ${l.english}</option>`).join('');
    quickLangSelect.value = state.lang;
    quickLangSelect.addEventListener('change', e=> applyLanguage(e.target.value));
  }

  function syncThemeButtons(){
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    $$('#quickThemeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
  }

  $$('#quickThemeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setTheme(btn.dataset.theme));
  });

  function closeSettingsPopover(){
    popover.hidden = true;
    triggers.forEach(tr=> tr.setAttribute('aria-expanded','false'));
  }
  function openSettingsPopover(trigger){
    syncThemeButtons();
    if(quickLangSelect) quickLangSelect.value = state.lang;
    popover.hidden = false;
    const popW = popover.offsetWidth || 272;
    const r = trigger.getBoundingClientRect();
    let left = r.right - popW;
    left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
    let top = r.bottom + 8;
    const popH = popover.offsetHeight || 220;
    if(top + popH > window.innerHeight - 12) top = Math.max(12, r.top - popH - 8);
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    triggers.forEach(tr=> tr.setAttribute('aria-expanded', tr===trigger ? 'true' : 'false'));
  }

  triggers.forEach(trigger=>{
    trigger.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(!popover.hidden){ closeSettingsPopover(); return; }
      openSettingsPopover(trigger);
    });
  });

  document.addEventListener('click', (e)=>{
    if(!popover.hidden && !popover.contains(e.target) && !e.target.closest('.js-settings-trigger')){
      closeSettingsPopover();
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !popover.hidden) closeSettingsPopover();
  });
  window.addEventListener('resize', closeSettingsPopover);

  $('#quickLogoutBtn').addEventListener('click', ()=>{
    closeSettingsPopover();
    doLogout();
  });
}

/* =========================================================
   PROFILE / SETTINGS
   ========================================================= */
function initProfile(){
  $('#settingName').addEventListener('change', e=>{ state.user.name=e.target.value; applyUserToChrome(); saveState(); });
  $('#settingLocation').addEventListener('change', e=>{
    state.user.location=e.target.value;
    if(!state.savedLocations.includes(e.target.value)) state.savedLocations.unshift(e.target.value);
    applyUserToChrome(); renderHome(); buildLocationPopover(); saveState();
  });
  $$('#settingRoleGrid .role-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      $$('#settingRoleGrid .role-card').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      state.user.role = card.dataset.role;
      applyUserToChrome(); renderHome(); renderCommand(); saveState();
      const restricted = ['command','climate'];
      const activePanel = $$('.panel').find(p=>!p.hidden);
      if(activePanel && restricted.includes(activePanel.id.replace('panel-','')) && $('#nav'+({command:'Command',climate:'Climate'}[activePanel.id.replace('panel-','')])).hidden){
        gotoView('chat');
        toast('Role updated to '+card.dataset.role+' — that section is no longer available');
      } else {
        toast('Role updated to '+card.dataset.role);
      }
    });
  });

  $$('#unitSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#unitSwitch .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); state.unit = btn.dataset.unit;
      renderHome(); saveState();
    });
  });
  $$('#themeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setTheme(btn.dataset.theme));
  });
  $('#settingLanguage').addEventListener('change', e=> applyLanguage(e.target.value));
  $('#btnOpenLanguagePicker').addEventListener('click', ()=> openLanguageGate('app'));

  $('#toggleLargeText').addEventListener('change', e=> document.body.classList.toggle('large-text', e.target.checked));
  $('#toggleContrast').addEventListener('change', e=> document.body.classList.toggle('high-contrast', e.target.checked));
  $('#toggleMotion').addEventListener('change', e=> document.body.classList.toggle('reduced-motion', e.target.checked));
  $('#toggleLowData').addEventListener('change', e=> toast(e.target.checked?'Low-data mode enabled':'Low-data mode disabled'));
  $('#toggleBattery').addEventListener('change', e=> toast(e.target.checked?'Battery-aware SOS enabled':'Battery-aware SOS disabled — not recommended'));

  renderSavedLocations();
  $('#btnAddLocation').addEventListener('click', ()=>{
    const v = $('#newLocationInput').value.trim();
    if(!v) return;
    if(!state.savedLocations.includes(v)) state.savedLocations.push(v);
    $('#newLocationInput').value='';
    renderSavedLocations(); buildLocationPopover(); saveState();
  });

  $('#btnLogout').addEventListener('click', doLogout);
}
function doLogout(){
  if(confirm('Log out of WeatherGPT?')){
    localStorage.removeItem('weathergpt_state');
    location.reload();
  }
}
function renderSavedLocations(){
  $('#savedLocationsList').innerHTML = state.savedLocations.map(loc=>`
    <div class="saved-location-row"><span>${ic('map-pin','icon icon-sm')} ${loc}</span><button data-loc="${loc}" aria-label="Remove">${ic('x','icon icon-sm')}</button></div>`).join('');
  $$('#savedLocationsList button').forEach(b=>{
    b.addEventListener('click', ()=>{
      state.savedLocations = state.savedLocations.filter(l=>l!==b.dataset.loc);
      renderSavedLocations(); buildLocationPopover(); saveState();
    });
  });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', ()=>{
  loadState();
  buildLanguageGate();
  buildSettingsLanguageOptions();
  initAuth();
  initLandingNav();
  initNav();
  initAlertTabs();
  initChat();
  initMap();
  initPlan();
  initClimate();
  initSos();
  initLocationSwitch();
  initProfile();
  initQuickSettings();

  // demo scope temp ticking
  setInterval(()=>{
    const el = $('#scopeTemp');
    if(el) el.textContent = (30 + Math.random()*3).toFixed(1)+'°C';
  }, 4000);

  let savedLang = null;
  try{ savedLang = localStorage.getItem('weathergpt_lang'); }catch(e){/* ignore */}
  if(savedLang){
    applyLanguage(savedLang);
    showView('landing');
  } else {
    showView('language');
  }

  // Splash sits on top (position:fixed) and fades once the correct
  // underlying view (language or landing) is already in place.
  initSplash(()=>{});
});

})();
