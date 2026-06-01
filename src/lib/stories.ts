export interface Story {
  id: string;
  title: string;
  content: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // in minutes
  category: string;
}

export const englishStories: Story[] = [
  {
    id: "en-1",
    title: "The Quick Adventure",
    content: "The quick brown fox jumps over the lazy dog. Programming requires patience and practice. Every day brings new opportunities to learn and grow. With dedication and focus, you can master any skill you set your mind to.",
    difficulty: "Beginner",
    duration: 2,
    category: "Fiction"
  },
  {
    id: "en-2",
    title: "Journey to Excellence",
    content: "Success is not final, failure is not fatal. It is the courage to continue that counts. The path to mastery is paved with consistent effort, deep learning, and a willingness to embrace challenges as learning milestones.",
    difficulty: "Intermediate",
    duration: 3,
    category: "Motivation"
  },
  {
    id: "en-3",
    title: "The Art of Programming",
    content: "In the world of software development, clean code is not just about functionality. It is about readability, maintenance, and elegance. Refactoring is the key to managing complexity in growing systems.",
    difficulty: "Advanced",
    duration: 5,
    category: "Technology"
  },
  {
    id: "en-4",
    title: "Daily Habits",
    content: "Small habits create remarkable results over time. Start your day with intention and purpose. Exercise, eat well, and read. The compounding effect of positive daily behaviors leads to long term success.",
    difficulty: "Beginner",
    duration: 2,
    category: "Lifestyle"
  },
  {
    id: "en-5",
    title: "The Digital Age",
    content: "We live in an era of unprecedented technological advancement. Artificial intelligence and machine learning are redefining industries, transforming how we work, communicate, and solve problems globally.",
    difficulty: "Intermediate",
    duration: 4,
    category: "Technology"
  },
  {
    id: "en-6",
    title: "Quantum Computing",
    content: "Quantum computing represents a paradigm shift in computational capabilities. Unlike classical bits that are restricted to binary states, quantum bits or qubits utilize superposition and entanglement.",
    difficulty: "Advanced",
    duration: 5,
    category: "Science"
  }
];

export const hindiStories: Story[] = [
  {
    id: "hi-1",
    title: "सफलता का मार्ग",
    content: "सफलता का कोई संक्षिप्त मार्ग नहीं होता। परिश्रम और निरंतर अभ्यास ही सफलता की कुंजी हैं। प्रतिदिन किया गया छोटा सा प्रयास भविष्य में बड़े परिणाम देता है। सकारात्मक सोच और लगन से हम कठिन से कठिन लक्ष्य को भी प्राप्त कर सकते हैं।",
    difficulty: "Beginner",
    duration: 2,
    category: "Motivation"
  },
  {
    id: "hi-2",
    title: "प्रौद्योगिकी का युग",
    content: "आज हम विज्ञान और तकनीक के युग में जी रहे हैं। कंप्यूटर और इंटरनेट ने हमारे जीवन को बेहद सरल और सुगम बना दिया है। तकनीक के सही उपयोग से हम हर असंभव कार्य को संभव कर सकते हैं। हमें नई तकनीकों को सीखने और अपनाने के लिए सदा तत्पर रहना चाहिए।",
    difficulty: "Intermediate",
    duration: 3,
    category: "Technology"
  },
  {
    id: "hi-3",
    title: "योग और स्वास्थ्य",
    content: "स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का निवास होता है। योग और प्राणायाम हमारे शरीर को निरोगी और मन को शांत रखते हैं। हमें प्रतिदिन योग करने की आदत डालनी चाहिए ताकि हम तनावमुक्त रहकर अपने लक्ष्यों को प्राप्त कर सकें।",
    difficulty: "Beginner",
    duration: 2,
    category: "Lifestyle"
  },
  {
    id: "hi-4",
    title: "प्रकृति का महत्व",
    content: "प्रकृति हमारी सबसे बड़ी शिक्षक है। वृक्ष, नदियाँ और पर्वत हमें निःस्वार्थ भाव से देना सिखाते हैं। पर्यावरण का संरक्षण करना हम सभी का नैतिक दायित्व है। यदि हम प्रकृति की रक्षा करेंगे, तभी हमारा भविष्य सुरक्षित और खुशहाल रह पाएगा।",
    difficulty: "Intermediate",
    duration: 3,
    category: "Nature"
  },
  {
    id: "hi-5",
    title: "कृत्रिम बुद्धिमत्ता",
    content: "कृत्रिम बुद्धिमत्ता या आर्टिफिशियल इंटेलिजेंस वर्तमान समय की सबसे क्रांतिकारी तकनीक है। यह मशीनों को सोचने, सीखने और निर्णय लेने की क्षमता प्रदान करती है, जिससे चिकित्सा, शिक्षा और उद्योग में व्यापक बदलाव आ रहे हैं।",
    difficulty: "Advanced",
    duration: 5,
    category: "Science"
  },
  {
    id: "hi-6",
    title: "भारतीय संस्कृति",
    content: "भारत विविधताओं का देश है जहाँ विभिन्न धर्मों, भाषाओं और संस्कृतियों का संगम है। अनेकता में एकता ही भारतीय संस्कृति की मूल पहचान है। यहाँ का गौरवशाली इतिहास और गौरवमयी परंपराएं पूरे विश्व को अपनी ओर आकर्षित करती हैं।",
    difficulty: "Advanced",
    duration: 5,
    category: "Culture"
  }
];
