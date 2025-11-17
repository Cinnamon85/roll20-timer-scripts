on('ready', () => {
    log('⏰ Digital Countdown Timer (Text Overlay Version) Loaded');

    let timerData = {
        interval: null,
        remaining: 0,
        token: null,
        textObj: null,
        flicker: false,
        paused: false
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const stopTimer = () => {
        if (timerData.interval) {
            clearInterval(timerData.interval);
            timerData.interval = null;
        }
        timerData.paused = true; // ★ 일시정지 상태
    };

    const updateText = (text, color = '#ffffff', flicker = false) => {
        if (!timerData.textObj) return;
        const flickerColor = flicker ? '#ff0000' : color;
        timerData.textObj.set({
            text: text,
            color: flickerColor
        });
    };

    const startCountdown = (duration, tokenName) => {
        stopTimer();

        const token = findObjs({ type: 'graphic', name: tokenName })[0];
        if (!token) {
            sendChat('Timer', `/w gm ⚠️ 토큰 "${tokenName}"을(를) 찾을 수 없습니다.`);
            return;
        }

        timerData.remaining = duration;
        timerData.token = token;
        timerData.flicker = false;
        timerData.paused = false;

        // 기존 텍스트 제거
        if (timerData.textObj) {
            timerData.textObj.remove();
            timerData.textObj = null;
        }

        // 오버레이 텍스트 생성
        const textObj = createObj('text', {
            _pageid: token.get('pageid'),
            layer: 'objects',
            left: token.get('left'),
            top: token.get('top'),
            text: formatTime(duration),
            color: '#ffffff',
            font_size: 48,
            font_family: 'Contrail One',
            text_align: 'center'
        });

        timerData.textObj = textObj;

        // 매초 갱신
        timerData.interval = setInterval(() => {
            timerData.remaining--;

            if (timerData.remaining <= 0) {
                updateText('00:00', '#ff0000');
                sendChat('Timer', `/em ⏰ 타이머 종료!`);
                stopTimer();
                return;
            }

            // 깜박임
            if (timerData.remaining <= 30) {
                timerData.flicker = !timerData.flicker;
            }

            updateText(formatTime(timerData.remaining), '#ffffff', timerData.flicker);

            // 토큰 위치 따라가기
            timerData.textObj.set({
                left: token.get('left'),
                top: token.get('top')
            });
        }, 1000);
    };

    const resumeTimer = () => {
        if (!timerData.paused || timerData.remaining <= 0 || !timerData.token) {
            sendChat('Timer', '/w gm ⚠️ 재개할 타이머가 없습니다.');
            return;
        }

        timerData.paused = false;

        // 다시 interval 시작
        timerData.interval = setInterval(() => {
            timerData.remaining--;

            if (timerData.remaining <= 0) {
                updateText('00:00', '#ff0000');
                sendChat('Timer', `/em ⏰ 타이머 종료!`);
                stopTimer();
                return;
            }

            if (timerData.remaining <= 30) {
                timerData.flicker = !timerData.flicker;
            }

            updateText(formatTime(timerData.remaining), '#ffffff', timerData.flicker);

            timerData.textObj.set({
                left: timerData.token.get('left'),
                top: timerData.token.get('top')
            });
        }, 1000);

        sendChat('Timer', '/w gm ▶️ 타이머 재개됨.');
    };

    on('chat:message', (msg) => {
        if (msg.type !== 'api') return;
        const args = msg.content.split(' ');
        const command = args[0];

        if (command === '!timer') {
            const action = args[1];
            switch (action) {

                // 타이머 시작
                case 'start': {
                    const minutes = parseInt(args[2]) || 0;
                    const seconds = parseInt(args[3]) || 0;
                    const tokenName = args.slice(4).join(' ') || 'Timer';
                    const totalSec = minutes * 60 + seconds;
                    startCountdown(totalSec, tokenName);
                    break;
                }

                // 일시정지
                case 'stop':
                    stopTimer();
                    sendChat('Timer', '/w gm ⏸️ 타이머 일시정지.');
                    break;

                // 재개
                case 'resume':
                    resumeTimer();
                    break;

                // 초기화
                case 'reset':
                    stopTimer();
                    if (timerData.textObj) {
                        timerData.textObj.remove();
                        timerData.textObj = null;
                    }
                    timerData.paused = false;
                    timerData.remaining = 0;
                    sendChat('Timer', '/w gm 🔁 타이머가 초기화되었습니다.');
                    break;

                default:
                    sendChat('Timer', '/w gm 사용법: !timer start [분] [초] [토큰이름]');
            }
        }
    });
});
