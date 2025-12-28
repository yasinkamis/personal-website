export const translations = {
  en: {
    // Terminal
    welcome: "Welcome to Yasin's Portfolio!",
    typeHelp: 'Type "help" to see available commands.',
    commandNotFound: 'Command not found',
    tryHelp: 'Type "help" for available commands.',

    // Commands
    helpDesc: 'Show available commands',
    aboutDesc: 'Learn about me',
    skillsDesc: 'View my technical skills',
    experienceDesc: 'View my work experience',
    educationDesc: 'View my education',
    contactDesc: 'View contact information',
    testimonialsDesc: 'View testimonials',
    clearDesc: 'Clear terminal',
    langDesc: 'Change language (en/tr)',
    suDesc: 'Switch to root user (admin)',
    exitDesc: 'Exit root mode',
    messageDesc: 'Send me a message',
    neofetchDesc: 'Display system info',
    cowsayDesc: 'Make a cow say something',
    fortuneDesc: 'Get a random fortune',
    matrixDesc: 'Enter the Matrix',
    dateDesc: 'Show current date and time',
    whoamiDesc: 'Display current user',
    historyDesc: 'Show command history',
    echoDesc: 'Echo a message',
    catDesc: 'Display file contents',
    lsDesc: 'List available files',
    pwdDesc: 'Print working directory',
    uptimeDesc: 'Show system uptime',
    pingDesc: 'Ping a host',
    curlDesc: 'Fetch social profiles',
    hackDesc: 'Initiate hacking sequence',
    coffeeDesc: 'Brew some coffee',
    sudoDesc: 'Execute command as superuser',
    rmDesc: 'Remove files (careful!)',

    // Admin commands
    messagesDesc: 'View received messages',
    editDesc: 'Edit portfolio data',
    translateDesc: 'Manage translations',
    statsDesc: 'View site statistics',

    // General
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Operation successful',
    accessDenied: 'Access denied. Root privileges required.',
    loginSuccess: 'Root access granted. Welcome, admin!',
    loginFailed: 'Authentication failed. Invalid credentials.',
    logoutSuccess: 'Logged out successfully.',
    messageSuccess: 'Message sent successfully! I will get back to you soon.',
    messageFailed: 'Failed to send message. Please try again.',
    noMessages: 'No messages found.',

    // Fun responses
    hackingStart: 'Initiating hacking sequence...',
    hackingProgress: 'Bypassing firewall...',
    hackingComplete: 'Just kidding! I am a frontend developer, not a hacker.',
    coffeeBrewStart: 'Brewing coffee...',
    coffeeBrewComplete: 'Here is your coffee!',
    matrixWelcome: 'Wake up, Neo... The Matrix has you...',
    sudoJoke: 'Nice try! But this is a portfolio, not a real terminal.',
    rmJoke: 'Deleting system... Just kidding! You almost gave me a heart attack.',

    // Neofetch
    os: 'OS',
    host: 'Host',
    kernel: 'Kernel',
    uptime: 'Uptime',
    packages: 'Packages',
    shell: 'Shell',
    resolution: 'Resolution',
    terminal: 'Terminal',
    cpu: 'CPU',
    memory: 'Memory',

    // Sections
    aboutMe: 'About Me',
    mySkills: 'My Skills',
    workExperience: 'Work Experience',
    myEducation: 'My Education',
    contactInfo: 'Contact Information',

    // Fortune messages
    fortune1: 'A bug in the code is worth two in the documentation.',
    fortune2: 'In the world of software, the early bird gets the bug.',
    fortune3: 'Code never lies, comments sometimes do.',
    fortune4: 'First, solve the problem. Then, write the code.',
    fortune5: 'It works on my machine!',
    fortune6: 'There are only 10 types of people: those who understand binary and those who do not.',
    fortune7: 'A good programmer looks both ways before crossing a one-way street.',
    fortune8: 'Deleted code is debugged code.',
    fortune9: 'The best code is no code at all.',
    fortune10: 'Programming is like writing a book... except if you miss a single comma, the whole thing makes no sense.',

    // UI Elements
    processing: 'Processing...',
    ready: 'Ready',
    skillsLabel: 'skills',
    jobsLabel: 'jobs',
    testimonialsLabel: 'testimonials',

    // Help sections
    availableCommands: 'Available Commands',
    funCommands: 'Fun Commands',
    adminCommands: 'Admin Commands',

    // About
    yearsExperience: 'Years Experience',
    projects: 'Projects',

    // Contact labels
    locationLabel: 'Location',
    availabilityLabel: 'Availability',
    responseTimeLabel: 'Response Time',
    contactTip: 'Use "message --name <name> --email <email> --subject <subject> --body <message>" to send me a message!',

    // Testimonials
    whatPeopleSay: 'What People Say',

    // Message command
    missingArguments: 'Missing required arguments!',
    usageMessage: 'Usage: message --name "Name" --email "Email" --subject "Subject" --body "Message"',
    exampleMessage: 'Example: message --name "John Doe" --email "john@example.com" --subject "Hello" --body "I loved your portfolio!"',
    invalidEmail: 'Invalid email address!',
    from: 'From',
    subject: 'Subject',

    // Messages (admin)
    messageMarkedRead: 'Message marked as read.',
    messageDeleted: 'Message deleted.',
    inbox: 'Inbox',

    // Stats
    siteStatistics: 'Site Statistics',
    visitors: 'Visitors',
    totalVisitors: 'Total Visitors',
    today: 'Today',
    messagesLabel: 'Messages',
    totalMessages: 'Total Messages',
    unread: 'Unread',
    lastMessage: 'Last message',
    noMessagesYet: 'No messages yet',
    commandsLabel: 'Commands',
    totalCommands: 'Total Commands',
    mostUsed: 'Most Used:',
    content: 'Content',
    skillsCount: 'Skills',
    jobsCount: 'Jobs',
    testimonialsCount: 'Testimonials',
    educationCount: 'Education',

    // Fun commands
    followWhiteRabbit: 'Follow the white rabbit...',
    mooHireMe: 'Moo! Hire Yasin!',
    coffeeFunFact: 'Fun fact: This portfolio was made with approximately 47 cups of coffee.',
    sudoTip: 'But if you want real admin access, try "su" command!',
    rmReadOnly: 'Nice try! But files here are read-only.',

    // Su/Exit
    enterCredentials: 'Enter root credentials',
    suUsage: 'Usage: su --user <email> --pass <password>',
    notLoggedIn: 'Not logged in.',

    // Curl
    clickToViewProfile: 'Click here to view profile',

    // Cat - readme.txt
    readmeContent: `
╔══════════════════════════════════════════════════════════════╗
║                    WELCOME TO MY PORTFOLIO                     ║
║                                                                ║
║  This is a terminal-based portfolio website.                  ║
║  Feel free to explore using the available commands.           ║
║                                                                ║
║  Type 'help' to see all available commands.                   ║
║  Type 'about' to learn more about me.                         ║
║  Type 'contact' to get my contact information.                ║
║                                                                ║
║  Have fun exploring! 🚀                                       ║
╚══════════════════════════════════════════════════════════════╝
`,
    secretContent: '🤫 Shhh... The secret is: There is no secret. Just hard work and coffee!',
    todoContent: `
[x] Build an awesome portfolio
[x] Learn React
[x] Master TypeScript
[ ] Take over the world (after coffee)
[ ] Sleep (eventually)
`,
  },
  tr: {
    // Terminal
    welcome: "Yasin'in Portfolyosuna Hoş Geldiniz!",
    typeHelp: 'Kullanılabilir komutları görmek için "help" yazın.',
    commandNotFound: 'Komut bulunamadı',
    tryHelp: 'Kullanılabilir komutlar için "help" yazın.',

    // Commands
    helpDesc: 'Kullanılabilir komutları göster',
    aboutDesc: 'Hakkımda bilgi al',
    skillsDesc: 'Teknik becerilerimi gör',
    experienceDesc: 'İş deneyimimi gör',
    educationDesc: 'Eğitimimi gör',
    contactDesc: 'İletişim bilgilerimi gör',
    testimonialsDesc: 'Referansları gör',
    clearDesc: 'Terminali temizle',
    langDesc: 'Dili değiştir (en/tr)',
    suDesc: 'Root kullanıcıya geç (admin)',
    exitDesc: 'Root modundan çık',
    messageDesc: 'Bana mesaj gönder',
    neofetchDesc: 'Sistem bilgisini göster',
    cowsayDesc: 'Bir ineğe konuştur',
    fortuneDesc: 'Rastgele bir söz al',
    matrixDesc: 'Matrix\'e gir',
    dateDesc: 'Tarih ve saati göster',
    whoamiDesc: 'Mevcut kullanıcıyı göster',
    historyDesc: 'Komut geçmişini göster',
    echoDesc: 'Bir mesajı yankıla',
    catDesc: 'Dosya içeriğini göster',
    lsDesc: 'Mevcut dosyaları listele',
    pwdDesc: 'Çalışma dizinini göster',
    uptimeDesc: 'Sistem çalışma süresini göster',
    pingDesc: 'Bir sunucuya ping at',
    curlDesc: 'Sosyal profilleri getir',
    hackDesc: 'Hackleme sekansını başlat',
    coffeeDesc: 'Kahve demle',
    sudoDesc: 'Komutu süper kullanıcı olarak çalıştır',
    rmDesc: 'Dosyaları sil (dikkatli ol!)',

    // Admin commands
    messagesDesc: 'Gelen mesajları gör',
    editDesc: 'Portfolyo verilerini düzenle',
    translateDesc: 'Çevirileri yönet',
    statsDesc: 'Site istatistiklerini gör',

    // General
    loading: 'Yükleniyor...',
    error: 'Bir hata oluştu',
    success: 'İşlem başarılı',
    accessDenied: 'Erişim reddedildi. Root yetkileri gerekli.',
    loginSuccess: 'Root erişimi sağlandı. Hoş geldin, admin!',
    loginFailed: 'Kimlik doğrulama başarısız. Geçersiz bilgiler.',
    logoutSuccess: 'Başarıyla çıkış yapıldı.',
    messageSuccess: 'Mesaj başarıyla gönderildi! En kısa sürede dönüş yapacağım.',
    messageFailed: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
    noMessages: 'Mesaj bulunamadı.',

    // Fun responses
    hackingStart: 'Hackleme sekansı başlatılıyor...',
    hackingProgress: 'Güvenlik duvarı aşılıyor...',
    hackingComplete: 'Şaka şaka! Ben frontend geliştiriciyim, hacker değil.',
    coffeeBrewStart: 'Kahve demleniyor...',
    coffeeBrewComplete: 'İşte kahveniz!',
    matrixWelcome: 'Uyan, Neo... Matrix seni izliyor...',
    sudoJoke: 'Güzel deneme! Ama bu bir portfolyo, gerçek bir terminal değil.',
    rmJoke: 'Sistem siliniyor... Şaka şaka! Neredeyse kalp krizi geçiriyordum.',

    // Neofetch
    os: 'İS',
    host: 'Ana Bilgisayar',
    kernel: 'Çekirdek',
    uptime: 'Çalışma Süresi',
    packages: 'Paketler',
    shell: 'Kabuk',
    resolution: 'Çözünürlük',
    terminal: 'Terminal',
    cpu: 'İşlemci',
    memory: 'Bellek',

    // Sections
    aboutMe: 'Hakkımda',
    mySkills: 'Becerilerim',
    workExperience: 'İş Deneyimi',
    myEducation: 'Eğitimim',
    contactInfo: 'İletişim Bilgileri',

    // Fortune messages
    fortune1: 'Koddaki bir bug, dokümantasyondaki ikisine bedeldir.',
    fortune2: 'Yazılım dünyasında, erken kalkan bug\'ı yakalar.',
    fortune3: 'Kod asla yalan söylemez, yorumlar bazen söyler.',
    fortune4: 'Önce problemi çöz. Sonra kodu yaz.',
    fortune5: 'Benim makinemde çalışıyor!',
    fortune6: 'Sadece 10 tür insan vardır: binary\'i anlayanlar ve anlamayanlar.',
    fortune7: 'İyi bir programcı tek yönlü bir yoldan geçerken bile iki tarafa da bakar.',
    fortune8: 'Silinen kod, debug edilmiş koddur.',
    fortune9: 'En iyi kod, hiç yazılmamış koddur.',
    fortune10: 'Programlama kitap yazmak gibidir... tek farkı bir virgülü kaçırırsanız, hiçbir şey anlam ifade etmez.',

    // UI Elements
    processing: 'İşleniyor...',
    ready: 'Hazır',
    skillsLabel: 'beceri',
    jobsLabel: 'iş',
    testimonialsLabel: 'referans',

    // Help sections
    availableCommands: 'Kullanılabilir Komutlar',
    funCommands: 'Eğlenceli Komutlar',
    adminCommands: 'Admin Komutları',

    // About
    yearsExperience: 'Yıl Deneyim',
    projects: 'Proje',

    // Contact labels
    locationLabel: 'Konum',
    availabilityLabel: 'Uygunluk',
    responseTimeLabel: 'Yanıt Süresi',
    contactTip: '"message --name <isim> --email <email> --subject <konu> --body <mesaj>" komutuyla bana mesaj gönderebilirsin!',

    // Testimonials
    whatPeopleSay: 'İnsanlar Ne Diyor',

    // Message command
    missingArguments: 'Gerekli argümanlar eksik!',
    usageMessage: 'Kullanım: message --name "İsim" --email "Email" --subject "Konu" --body "Mesaj"',
    exampleMessage: 'Örnek: message --name "Ali Veli" --email "ali@example.com" --subject "Merhaba" --body "Portfolyonuzu çok beğendim!"',
    invalidEmail: 'Geçersiz e-posta adresi!',
    from: 'Gönderen',
    subject: 'Konu',

    // Messages (admin)
    messageMarkedRead: 'Mesaj okundu olarak işaretlendi.',
    messageDeleted: 'Mesaj silindi.',
    inbox: 'Gelen Kutusu',

    // Stats
    siteStatistics: 'Site İstatistikleri',
    visitors: 'Ziyaretçiler',
    totalVisitors: 'Toplam Ziyaretçi',
    today: 'Bugün',
    messagesLabel: 'Mesajlar',
    totalMessages: 'Toplam Mesaj',
    unread: 'Okunmamış',
    lastMessage: 'Son mesaj',
    noMessagesYet: 'Henüz mesaj yok',
    commandsLabel: 'Komutlar',
    totalCommands: 'Toplam Komut',
    mostUsed: 'En Çok Kullanılan:',
    content: 'İçerik',
    skillsCount: 'Beceri',
    jobsCount: 'İş',
    testimonialsCount: 'Referans',
    educationCount: 'Eğitim',

    // Fun commands
    followWhiteRabbit: 'Beyaz tavşanı takip et...',
    mooHireMe: 'Möö! Yasin\'i işe al!',
    coffeeFunFact: 'İlginç bilgi: Bu portfolyo yaklaşık 47 fincan kahve ile yapıldı.',
    sudoTip: 'Ama gerçek admin erişimi istiyorsan, "su" komutunu dene!',
    rmReadOnly: 'Güzel deneme! Ama buradaki dosyalar salt okunur.',

    // Su/Exit
    enterCredentials: 'Root bilgilerini girin',
    suUsage: 'Kullanım: su --user <email> --pass <şifre>',
    notLoggedIn: 'Giriş yapılmamış.',

    // Curl
    clickToViewProfile: 'Profili görüntülemek için tıklayın',

    // Cat - readme.txt
    readmeContent: `
╔══════════════════════════════════════════════════════════════╗
║                   PORTFOLYOMA HOŞ GELDİNİZ                     ║
║                                                                ║
║  Bu terminal tabanlı bir portfolyo web sitesidir.             ║
║  Mevcut komutları kullanarak keşfetmekten çekinmeyin.         ║
║                                                                ║
║  Tüm komutları görmek için 'help' yazın.                      ║
║  Hakkımda bilgi almak için 'about' yazın.                     ║
║  İletişim bilgilerim için 'contact' yazın.                    ║
║                                                                ║
║  İyi keşifler! 🚀                                             ║
╚══════════════════════════════════════════════════════════════╝
`,
    secretContent: '🤫 Şşşt... Sır şu: Sır yok. Sadece çok çalışma ve kahve!',
    todoContent: `
[x] Harika bir portfolyo yapmak
[x] React öğrenmek
[x] TypeScript'te ustalaşmak
[ ] Dünyayı fethetmek (kahveden sonra)
[ ] Uyumak (sonunda)
`,
  },
};

export type TranslationKey = keyof typeof translations.en;
