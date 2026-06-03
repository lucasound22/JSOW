// JSOW v9 - State
const B=[
{id:0,n:"First Sip",i:"🥂",d:"Complete your first lesson"},
{id:1,n:"Grape Explorer",i:"🍇",d:"Complete 10 lessons"},
{id:2,n:"Quiz Master",i:"🧠",d:"Score 80%+ on 3 quizzes"},
{id:3,n:"Tasting Pro",i:"👃",d:"Log 5 tasting notes"},
{id:4,n:"Region Rover",i:"🌍",d:"Complete Wine Regions course"},
{id:5,n:"Streak Star",i:"🔥",d:"Achieve a 7-day streak"},
{id:6,n:"Wine Scholar",i:"🎓",d:"Complete WSET Level 2"},
{id:7,n:"Grand Cru",i:"🏆",d:"Earn 1000 points"},
{id:8,n:"Sommelier",i:"🍷",d:"Complete all 7 courses"},
{id:9,n:"Community Leader",i:"💬",d:"Post 10 discussions"}
];

// ── EVENTS ──
const EV=[
{dt:"2026-06-09",t:"WSET Level 1 Classroom Day",ty:"exam",d:"Full-day intensive + 30 MCQ exam. Bring photo ID.",l:"Joval Melbourne, Abbotsford"},
{dt:"2026-06-15",t:"Barossa Shiraz Masterclass",ty:"masterclass",d:"Guided tasting of 8 premium Barossa wines with Hilary Fordham DipWSET.",l:"Joval Melbourne"},
{dt:"2026-06-22",t:"WSET Level 2 — Week 1 of 3",ty:"exam",d:"First classroom session covering LO1–LO2.",l:"Joval Melbourne"},
{dt:"2026-06-29",t:"WSET Level 2 — Week 2 of 3",ty:"exam",d:"Session covering LO3–LO4: grape varieties and regions.",l:"Joval Melbourne"},
{dt:"2026-07-04",t:"Winter Wine Dinner",ty:"tasting",d:"Five-course dinner with matched wines. $150pp.",l:"Mezzanine, Abbotsford"},
{dt:"2026-07-06",t:"WSET Level 2 — Week 3 + Exam",ty:"exam",d:"Final session + 50 MCQ exam (55% pass mark).",l:"Joval Melbourne"},
{dt:"2026-07-12",t:"Blind Tasting Workshop",ty:"workshop",d:"Hands-on SAT practice — 8 wines blind. All levels welcome.",l:"Joval Melbourne"},
{dt:"2026-07-20",t:"WSET Level 3 Tasting Masterclass",ty:"workshop",d:"Mandatory tasting prep for L3 candidates. 12 wines.",l:"Joval Melbourne"},
{dt:"2026-08-03",t:"WSET Level 3 — Intensive Week",ty:"exam",d:"5-day intensive. Exam day 5: 50 MCQ + short-answer + blind tasting.",l:"Joval Melbourne"},
{dt:"2026-08-15",t:"Australian Wine Regions Tour",ty:"masterclass",d:"Virtual guided tasting through 6 Australian GIs.",l:"Online / Zoom"}
];

// ── COMMUNITY ──
const TH=[
{id:1,a:"Hilary Fordham",t:"Welcome to JSOW Community!",b:"This is your space to discuss wine, ask questions, and connect with fellow enthusiasts. Be kind, be curious, and share your journey!",dt:"2026-05-20",u:24,r:[{a:"Sarah M.",b:"So excited! Just enrolled in WSET L1. Any tips for the exam?",dt:"2026-05-21"},{a:"James K.",b:"Looking forward to sharing Barossa tasting notes.",dt:"2026-05-22"},{a:"Hilary Fordham",b:"Welcome both! Sarah — focus on the SAT method and grape variety flashcards.",dt:"2026-05-22"}]},
{id:2,a:"Michael T.",t:"Best Aussie Shiraz under $30?",b:"Looking for everyday Shiraz recommendations from Barossa or McLaren Vale.",dt:"2026-05-25",u:15,r:[{a:"David F.",b:"Penfolds Koonunga Hill — consistently great. Also try Grant Burge Benchmark.",dt:"2026-05-25"},{a:"Lisa W.",b:"Hentley Farm The Beast from Barossa — incredible for the price.",dt:"2026-05-26"},{a:"Tom B.",b:"Jim Barry The Lodge Hill Shiraz from Clare Valley. Beautiful peppery style.",dt:"2026-05-27"}]},
{id:3,a:"Emma L.",t:"Tips for WSET Level 2 exam?",b:"Starting prep next month. How much study time did everyone need?",dt:"2026-05-28",u:18,r:[{a:"Tom B.",b:"About 2 hours per week for 8 weeks. Focus on SAT and grape flashcards.",dt:"2026-05-29"},{a:"Sarah M.",b:"I used the Brainscape WSET app — really helped with spaced repetition!",dt:"2026-05-30"}]},
{id:4,a:"David F.",t:"Burgundy vs Barossa Pinot — discuss!",b:"Had a 2019 Domaine Drouhin alongside a 2020 Yarra Valley Pinot last night. Completely different expressions of the same grape.",dt:"2026-05-30",u:21,r:[{a:"Emma L.",b:"That's exactly what WSET L2 is about! Climate and winemaking make all the difference.",dt:"2026-05-31"}]}
];

// ── LEADERBOARD ──
const LB=[{n:"Sarah M.",p:2450,b:7},{n:"James K.",p:1980,b:6},{n:"Emma L.",p:1720,b:5},{n:"Tom B.",p:1350,b:5},{n:"David F.",p:980,b:4},{n:"Lisa W.",p:750,b:3},{n:"Mark R.",p:520,b:2},{n:"You",p:150,b:1}];

// ── JOURNEY MAP ──
const JR=[{i:"🍇",n:"Fundamentals",c:1},{i:"🏅",n:"WSET L1",c:2},{i:"🇫🇷",n:"France",c:6},{i:"🇮🇹",n:"Italy",c:6},{i:"🇦🇺",n:"Australia",c:6},{i:"🇳🇿",n:"NZ",c:6},{i:"🍽️",n:"Pairing",c:5},{i:"🎓",n:"WSET L2",c:3},{i:"🏆",n:"WSET L3",c:4},{i:"👑",n:"Grand Cru",c:4}];

// ── STUDENTS (teacher/admin) ──
const STUDENTS=[
{id:1,name:"Sarah Mitchell",email:"sarah.m@example.com",enrolled:[1,2,3],lessons:28,points:2450,lastActive:"2026-05-31",status:"active",wset:"Level 2",notes:3,quizAvg:85},
{id:2,name:"James Kim",email:"james.k@example.com",enrolled:[1,2,5],lessons:22,points:1980,lastActive:"2026-05-30",status:"active",wset:"Level 2",notes:5,quizAvg:78},
{id:3,name:"Emma Lawrence",email:"emma.l@example.com",enrolled:[2,3],lessons:18,points:1720,lastActive:"2026-05-29",status:"active",wset:"Level 2",notes:2,quizAvg:82},
{id:4,name:"Tom Bradley",email:"tom.b@example.com",enrolled:[1,3,6],lessons:15,points:1350,lastActive:"2026-05-28",status:"active",wset:"Level 1",notes:4,quizAvg:74},
{id:5,name:"David Foster",email:"david.f@example.com",enrolled:[1,5],lessons:11,points:980,lastActive:"2026-05-25",status:"active",wset:"Level 1",notes:1,quizAvg:71},
{id:6,name:"Lisa Wong",email:"lisa.w@example.com",enrolled:[1,7],lessons:8,points:750,lastActive:"2026-05-20",status:"inactive",wset:"Level 1",notes:2,quizAvg:68},
{id:7,name:"Mark Reynolds",email:"mark.r@example.com",enrolled:[1],lessons:4,points:520,lastActive:"2026-05-15",status:"inactive",wset:"None",notes:0,quizAvg:62},
{id:8,name:"Angela Rossi",email:"angela.r@example.com",enrolled:[2,3,4],lessons:42,points:3200,lastActive:"2026-06-01",status:"active",wset:"Level 3",notes:8,quizAvg:91},
{id:9,name:"Chris Patel",email:"chris.p@example.com",enrolled:[1,2,3,4,5,6,7],lessons:14,points:890,lastActive:"2026-05-27",status:"active",wset:"Level 1",notes:1,quizAvg:73},
{id:10,name:"Nina Svensson",email:"nina.s@example.com",enrolled:[2,3,5,6],lessons:35,points:2100,lastActive:"2026-05-31",status:"active",wset:"Level 2",notes:6,quizAvg:88}
];

var teacherQuizzes=JSON.parse(JSON.stringify(Q));

// ── STATE (student enrolled in ALL 7 courses) ──
var DEF={enrolled:[1,2,3,4,5,6,7],progress:{},points:150,streak:3,cart:[],cq:[],tn:[],certs:[],ub:[0],
  threads:JSON.parse(JSON.stringify(TH)),cpn:null,cm:5,cy:2026,et:null,
  curCourse:null,curMi:0,curLi:0,quizQs:[],quizIdx:0,quizSel:-1,quizScore:0,quizTimer:0,quizInt:null,
  user:null,role:null,session:null,
  lessonNotes:{},
  tStudents:JSON.parse(JSON.stringify(STUDENTS)),
  tMessages:[
    {id:1,from:"Sarah Mitchell",subj:"Question about Chardonnay lesson",body:"Hi Hilary, could you clarify the difference between Chablis and Meursault styles?",date:"2026-05-30",read:false,reply:""},
    {id:2,from:"Tom Bradley",subj:"Missed classroom session",body:"I wasn't able to attend the June 22 session. Is there a recording available?",date:"2026-05-29",read:true,reply:"Hi Tom, yes — the recording is now available in the WSET L2 course under Week 1."},
    {id:3,from:"Emma Lawrence",subj:"Tasting note feedback request",body:"Could you review my latest Barossa Shiraz tasting note? I'm not sure my palate assessment is detailed enough for L2.",date:"2026-05-28",read:false,reply:""}
  ],
  aPromos:[
    {id:1,code:"JSOW10",disc:10,uses:45,maxUses:100,exp:"2026-12-31",status:"Active"},
    {id:2,code:"WINE20",disc:20,uses:23,maxUses:50,exp:"2026-08-31",status:"Active"},
    {id:3,code:"FIRSTSIP",disc:15,uses:112,maxUses:200,exp:"2026-06-30",status:"Active"},
    {id:4,code:"WSET2025",disc:25,uses:67,maxUses:100,exp:"2025-12-31",status:"Expired"},
    {id:5,code:"HILARY50",disc:50,uses:3,maxUses:5,exp:"2026-07-31",status:"Active"}
  ],
  aEvents:JSON.parse(JSON.stringify(EV))
};

var S;
function loadState(){try{var s=localStorage.getItem('jsow9');S=s?Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(s)):JSON.parse(JSON.stringify(DEF))}catch(e){S=JSON.parse(JSON.stringify(DEF))}}
function saveState(){try{localStorage.setItem('jsow9',JSON.stringify(S))}catch(e){}}
// ═══════════════════════════════════════════
// CORE FUNCTIONS — v3 (all enhancements)
// ═══════════════════════════════════════════

