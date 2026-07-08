
    
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

            creatorName = decodeURIComponent(cParam);
            inviteeName = decodeURIComponent(iParam);
            botToken = tParam ? decodeURIComponent(tParam) : "";
            chatId = chParam ? decodeURIComponent(chParam) : "";

            setupActive = false;
            

            document.getElementById('welcomeTitle').innerText = `Ողջո՜ւյն, ${inviteeName} ✨`;
            document.getElementById('welcomeDesc').innerText = `${creatorName}-ը քեզ համար հատուկ անակնկալ ունի։ Պատրա՞ստ ես պատասխանել մի քանի հարցի 😜`;
            document.getElementById('questionTitle').innerText = `Կգա՞ս ինձ հետ ժամադրության, ${inviteeName}՞ 🌹`;
            document.getElementById('badgeNames').innerText = `✨ Հատուկ հրավեր ${inviteeName}-ին ✨`;
            
            showScreen('screen1');
            setupDatePickerLimits();
        }
    };


    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }


    function nextScreen(num) {
        showScreen('screen' + num);
 
        if (num === 2) {
            const noBtn = document.getElementById('noBtn');
            noBtn.style.position = 'absolute';
            noBtn.style.left = '50%';
            noBtn.style.transform = 'translateX(-50%)';
            noBtn.style.top = '170px';
        }
    }

  
    window.addEventListener("beforeunload", function (e) {
        if (!setupActive && !document.getElementById('screen6').classList.contains('active')) {
            let confirmMsg = "Դուք դեռ չեք ավարտել պատասխանները։";
            (e || window.event).returnValue = confirmMsg;
            return confirmMsg;
        }
    });

 
    function moveNoButton() {
        const btn = document.getElementById('noBtn');
        const container = document.getElementById('mainContainer');
        const containerRect = container.getBoundingClientRect();
        

        const maxX = containerRect.width - btn.offsetWidth - 30;
        const maxY = containerRect.height - btn.offsetHeight - 40;

        const randomX = Math.max(15, Math.random() * maxX);
        const randomY = Math.max(60, Math.random() * maxY);

        btn.style.left = randomX + 'px';
        btn.style.top = randomY + 'px';
        btn.style.transform = 'none';
    }

    function setupDatePickerLimits() {
        const datePicker = document.getElementById('datePicker');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        const firstDay = `${year}-${month}-01`;
        const lastDayObj = new Date(year, now.getMonth() + 1, 0);
        const lastDay = `${year}-${month}-${String(lastDayObj.getDate()).padStart(2, '0')}`;

        datePicker.min = firstDay;
        datePicker.max = lastDay;

        datePicker.value = `${year}-${month}-${String(now.getDate()).padStart(2, '0')}`;
    }


    function selectTime(val) {
        answers.time = val;
        nextScreen(4);
    }

    function selectCustomDate() {
        const val = document.getElementById('datePicker').value;
        if (val) {
   
            const dateParts = val.split('-');
            answers.time = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} (Կոնկրետ Օր) 📅`;
            nextScreen(4);
        }
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
            }).catch(err => console.error("Չհաջողվեց ուղարկել Telegram-ին:", err));
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

    // --- Հղումը պատճենելու ֆունկցիա (Անվտանգ iFrame-ում) ---
    function copyGeneratedLink() {
        const linkText = document.getElementById('generatedLinkText').innerText;
        
        // Ստեղծում ենք ժամանակավոր input՝ պատճենման համար
        const tempInput = document.createElement("input");
        tempInput.value = linkText;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // Հեռախոսների համար
        
        try {
            document.execCommand('copy');
            alert("Հղումը պատճենվեց հիշողության մեջ (clipboard)։ Ուղարկեք այն նրան ✨");
        } catch (err) {
            alert("Չհաջողվեց ավտոմատ պատճենել։ Խնդրում ենք պատճենել ձեռքով։");
        }
        
        document.body.removeChild(tempInput);
    }
