let creatorName = "Creator name";
let inviteeName = "Invite Name";
let botToken = "";
let chatId = "";
let setupActive = false;

let answers = {
    time: '',
    location: '',
    food: ''
};

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const cParam = urlParams.get('c');
    const iParam = urlParams.get('i');
    const tParam = urlParams.get('t');
    const chParam = urlParams.get('ch');

    if (!cParam || !iParam) {
        setupActive = true;
        showScreen('setupScreen');
    } else {
        creatorName = cParam;
        inviteeName = iParam;
        botToken = tParam || "";
        chatId = chParam || "";

        setupActive = false;
        
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeDesc = document.getElementById('welcomeDesc');
        const questionTitle = document.getElementById('questionTitle');
        const badgeNames = document.getElementById('badgeNames');

        if (welcomeTitle) welcomeTitle.innerText = `Ողջո՜ւյն, ${inviteeName} ✨`;
        if (welcomeDesc) welcomeDesc.innerText = `${creatorName}-ը քեզ համար հատուկ անակնկալ ունի։ Պատրա՞ստ ես պատասխանել մի քանի հարցի 😜`;
        if (questionTitle) questionTitle.innerText = `Կգա՞ս ինձ հետ ժամադրության, ${inviteeName}՞ 🌹`;
        if (badgeNames) badgeNames.innerText = `✨ Հատուկ հրավեր ${inviteeName}-ին ✨`;
        
        showScreen('screen1');
        setupDatePickerLimits();
    }

    setupYesHearts();
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.classList.add('active');
        activeScreen.style.display = 'block';
    }
}

function nextScreen(num) {
    showScreen('screen' + num);

    if (num === 2) {
        const noBtn = document.getElementById('noBtn');
        if (noBtn) {
            noBtn.style.position = 'relative';
            noBtn.style.left = '0px';
            noBtn.style.top = '0px';
            noBtn.classList.remove('btn-small');
            noBtn.textContent = 'Ոչ Ոչ 😜';
        }

        const yesBtn = document.getElementById('yesBtn');
        if (yesBtn) {
            yesBtn.classList.remove('btn-large', 'btn-extra-large');
        }

        window.noHoverCount = 0;
    }
}


function spawnHeart(emoji, event) {
    const heart = document.createElement('div');
    heart.className = 'floating-emoji';
    heart.innerText = emoji;

    let x = 0;
    let y = 0;

    if (event && event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
    } else if (event && event.target) {
        const rect = event.target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }

    const randomOffsetX = (Math.random() - 0.5) * 40;
    const randomOffsetY = (Math.random() - 0.5) * 20;

    heart.style.left = (x + randomOffsetX) + 'px';
    heart.style.top = (y + randomOffsetY) + 'px';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1000);
}


function setupYesHearts() {
    const yesBtn = document.getElementById('yesBtn');
    if (!yesBtn) return;

    const hearts = ['❤️', '💖', '💕', '💗', '😍'];
    let lastSpawn = 0;

    const triggerYesHearts = (e) => {
        const now = Date.now();
        if (now - lastSpawn > 100) { 
            const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
            spawnHeart(randomHeart, e);
            lastSpawn = now;
        }
    };

    yesBtn.addEventListener('mousemove', triggerYesHearts);
    yesBtn.addEventListener('touchstart', triggerYesHearts);
}


function moveNoButton() {
    const btn = document.getElementById('noBtn');
    const container = document.getElementById('mainContainer');
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();

    btn.style.position = 'absolute';

    const maxX = containerRect.width - btn.offsetWidth - 20;
    const maxY = containerRect.height - btn.offsetHeight - 20;

    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(40, Math.floor(Math.random() * maxY));

    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
}


function handleNoHover(event) {
    if (typeof window.noHoverCount === 'undefined') {
        window.noHoverCount = 0;
    }
    window.noHoverCount += 1;

    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');


    spawnHeart('💔', event);

    if (yesBtn) yesBtn.classList.add('btn-large');
    if (noBtn) noBtn.classList.add('btn-small');

    // Ճիշտ պայմանական ստուգումներ (if / else if / else)
    if (window.noHoverCount === 1) {
        if (noBtn) noBtn.textContent = 'Դե լավ դե համաձայնվի😄';
    } else if (window.noHoverCount === 2) {
        if (noBtn) noBtn.textContent = 'Վստահ ես՞';
    } else if (window.noHoverCount === 3) {
        if (noBtn) noBtn.textContent = 'Խնդրում եմմմմ🥺՞';
    } else {
        if (noBtn) noBtn.textContent = 'Ախր ես էլ սիրտ ունեմ 💔';
        if (yesBtn) yesBtn.classList.add('btn-extra-large');
    }

    moveNoButton();
}

function setupDatePickerLimits() {
    const datePicker = document.getElementById('datePicker');
    if (!datePicker) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const firstDay = `${year}-${month}-01`;
    const lastDayObj = new Date(year, now.getMonth() + 1, 0);
    const lastDay = `${year}-${month}-${String(lastDayObj.getDate()).padStart(2, '0')}`;

    datePicker.min = firstDay;
    datePicker.max = lastDay;

    datePicker.value = `${year}-${month}-${String(now.getDate()).padStart(2, '0')}`;
    const timePicker = document.getElementById('timePicker');
    if (timePicker) timePicker.value = now.toTimeString().slice(0, 5);
}

function selectTime(val) {
    answers.time = val;
    nextScreen(4);
}

function selectCustomDateTime() {
    const dateVal = document.getElementById('datePicker').value;
    const timeVal = document.getElementById('timePicker').value;

    if (!dateVal || !timeVal) {
        alert('Խնդրում ենք ընտրեք ամսաթիվը և ժամը։');
        return;
    }

    const dateParts = dateVal.split('-');
    answers.time = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${timeVal}`;
    nextScreen(4);
}

function selectPlace(val) {
    answers.location = val;
    nextScreen(5);
}

function showPapaInput() {
    document.getElementById('papaBox').classList.remove('hidden');
}

function submitPapaLocation() {
    const customLoc = document.getElementById('customLocation').value;
    if (customLoc.trim() !== '') {
        answers.location = `Պապայի թույլտվությամբ -> 📍 ${customLoc}`;
        nextScreen(5);
    } else {
        document.getElementById('customLocation').focus();
    }
}

function finish(foodVal) {
    answers.food = foodVal;
    
    if (botToken && chatId) {
        const messageText = `🔔 *ԺԱՄԱԴՐՈՒԹՅԱՆ ՊԱՏԱՍԽԱՆ* 🔔\n\n` +
                            `👤 *Ումից:* ${inviteeName}\n` +
                            `🎯 *Ում:* ${creatorName}\n\n` +
                            `📅 *Ազատ օրեր:* ${answers.time}\n` +
                            `📍 *Վայր:* ${answers.location}\n` +
                            `🍣 *Ուտելիք/Խմելիք:* ${answers.food}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
                parse_mode: 'Markdown'
            })
        }).catch(err => console.error("Telegram API error:", err));
    }

    nextScreen(6);
}

function generateInvitationLink() {
    const creator = document.getElementById('setupCreator').value.trim();
    const invitee = document.getElementById('setupInvitee').value.trim();
    const tToken = document.getElementById('setupBotToken').value.trim();
    const cId = document.getElementById('setupChatId').value.trim();

    if (!creator || !invitee) {
        alert("Խնդրում ենք լրացնել գոնե Ձեր և Նրա անունները։");
        return;
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('c', creator);
    params.set('i', invitee);
    if (tToken) params.set('t', tToken);
    if (cId) params.set('ch', cId);

    const finalUrl = baseUrl + '?' + params.toString();
    
    document.getElementById('generatedLinkText').innerText = finalUrl;
    document.getElementById('linkResultBox').classList.remove('hidden');
}

function copyGeneratedLink() {
    const linkText = document.getElementById('generatedLinkText').innerText;
    
    const tempInput = document.createElement("input");
    tempInput.value = linkText;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        alert("Հղումը պատճենվեց հիշողության մեջ (clipboard)։ Ուղարկեք այն նրան ✨");
    } catch (err) {
        alert("Չհաջողվեց պատճենել։");
    }
    document.body.removeChild(tempInput);
}