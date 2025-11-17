on('ready', () => {
    log('⏰ Digital Countdown Timer (Text Overlay Version) Loaded');

    let timerData = {
        interval: null,
        remaining: 0,
        token: null,
        textObj: null,
        flicker: false
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

        // 기존 텍스트 제거
        if (timerData.textObj) {
            timerData.textObj.remove();
            timerData.textObj = null;
        }

        // 토큰 중심 좌표
        const tokenX = token.get('left');
        const tokenY = token.get('top');
        const pageId = token.get('pageid');

        // 텍스트 오브젝트 생성
        const textObj = createObj('text', {
            _pageid: pageId,
            layer: 'objects',
            left: tokenX,
            top: tokenY,
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

            // 깜박임(남은 시간 30초 이하)
            if (timerData.remaining <= 30) {
                timerData.flicker = !timerData.flicker;
            }

            updateText(formatTime(timerData.remaining), '#ffffff', timerData.flicker);

            // 텍스트를 토큰 위치에 고정
            timerData.textObj.set({
                left: token.get('left'),
                top: token.get('top')
            });
        }, 1000);
    };

    on('chat:message', (msg) => {
        if (msg.type !== 'api') return;
        const args = msg.content.split(' ');
        const command = args[0];

        if (command === '!timer') {
            const action = args[1];
            switch (action) {
                case 'start': {
                    const minutes = parseInt(args[2]) || 0;
                    const seconds = parseInt(args[3]) || 0;
                    const tokenName = args.slice(4).join(' ') || 'Timer';
                    const totalSec = minutes * 60 + seconds;
                    startCountdown(totalSec, tokenName);
                    break;
                }
                case 'stop':
                    stopTimer();
                    sendChat('Timer', '/w gm ⏸️ 타이머가 중지되었습니다.');
                    break;
                case 'reset':
                    stopTimer();
                    if (timerData.textObj) {
                        timerData.textObj.remove();
                        timerData.textObj = null;
                    }
                    sendChat('Timer', '/w gm 🔁 타이머가 초기화되었습니다.');
                    break;
                default:
                    sendChat('Timer', '/w gm 사용법: !timer start [분] [초] [토큰이름]');
            }
        }
    });
});
