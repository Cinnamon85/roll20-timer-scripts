![Timer_git_ex](https://github.com/user-attachments/assets/211e0060-d0d8-4959-849e-c9e505852019)

## ⏱️ Roll20 Token-Based Digital Countdown Timer API  
토큰 위에 디지털 카운트다운 오버레이를 표시하는 Roll20 Pro 전용 API입니다.  
남은 시간 30초 이하에서는 자동 깜박임, 타이머 일시정지/재개 기능까지 지원합니다.

---

## ✨ 기능 요약

- ✔ 토큰 이름 기반 타이머 시작  
- ✔ 텍스트가 토큰 위치를 따라다님  
- ✔ 30초 이하 자동 깜박임  
- ✔ `stop` 으로 일시정지  
- ✔ `resume` 으로 이어서 재개  
- ✔ `reset` 으로 완전 초기화  
- ✔ 종료 시 붉은색 “00:00” 표시 및 알림  

---

# 🕹️ **명령어 목록**

## ▶ 1) 타이머 시작
!timer start [분] [초] [토큰이름]

!timer start 1 30 Boss
→ Boss 토큰 위에서 1분 30초 카운트다운

---

## ▶ 2) 타이머 일시정지
!timer stop

---

## ▶ 3) 타이머 재개 (Resume)
!timer resume

조건:  
- stop으로 일시정지된 상태여야 함  
- 남은 시간 > 0  
- 연결된 토큰이 존재해야 함  

---

## ▶ 4) 타이머 초기화
!timer reset
- 화면의 타이머 텍스트 제거  
- interval 중지  
- 모든 상태 초기화

---

# 📌 설치 방법

1. Roll20 → 캠페인 → **Settings → API Scripts**  
2. “New Script” 클릭  
3. 이름: `timer.js`  
4. 제공된 코드 전체 붙여넣기  
5. **Save Script** 클릭  

---







