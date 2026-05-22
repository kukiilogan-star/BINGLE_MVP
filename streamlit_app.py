import streamlit as st
import streamlit.components.v1 as components
import os
import base64

# Set page configuration to wide layout and set title and favicon
st.set_page_config(
    page_title="BINGLE - 마음 냉장고 서비스 피치덱 및 발표 포털",
    page_icon="🧊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Function to load local image as base64 to ensure it renders flawlessly in Streamlit
def get_image_base64(path):
    if os.path.exists(path):
        with open(path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    return ""

# Custom premium styling using neobrutalist aesthetics
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Inter:wght@400;600;700;800&family=Gaegu:wght@400;700&display=swap');
    
    body {
        background-color: #fafaf9;
    }
    
    /* Neobrutalist design accents */
    .neo-title-banner {
        background-color: #bae6fd;
        padding: 1.5rem;
        border: 4px solid #28180b;
        box-shadow: 8px 8px 0px 0px #28180b;
        border-radius: 20px;
        margin-bottom: 2rem;
        text-align: center;
    }
    .neo-title-text {
        font-family: 'Outfit', 'Inter', sans-serif;
        font-size: 2.2rem;
        font-weight: 900;
        color: #28180b;
        margin: 0;
    }
    .neo-subtitle-text {
        font-family: 'Outfit', 'Inter', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: #28180b;
        opacity: 0.8;
        margin-top: 0.25rem;
    }
    
    .neo-card {
        background-color: #ffffff;
        border: 3px solid #28180b;
        box-shadow: 5px 5px 0px 0px #28180b;
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        color: #28180b;
    }
    
    .neo-badge {
        background-color: #ff8c69;
        color: #28180b;
        font-weight: 900;
        padding: 0.3rem 0.8rem;
        border: 2px solid #28180b;
        border-radius: 12px;
        font-size: 0.85rem;
        display: inline-block;
        margin-bottom: 0.75rem;
        font-family: 'Outfit', sans-serif;
    }
    
    .neo-header {
        font-family: 'Outfit', 'Inter', sans-serif;
        font-weight: 900;
        color: #28180b;
        margin-top: 0.5rem;
        margin-bottom: 0.75rem;
    }
    
    /* Phone frame mockup rendering in neobrutalism */
    .phone-mockup-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0;
    }
    .phone-mockup {
        width: 360px;
        height: 720px;
        border: 10px solid #28180b;
        border-radius: 40px;
        box-shadow: 12px 12px 0px 0px #28180b;
        background-color: #000;
        position: relative;
        overflow: hidden;
    }
    .phone-notch {
        width: 140px;
        height: 25px;
        background-color: #28180b;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .phone-notch-camera {
        width: 10px;
        height: 10px;
        background-color: #1a1510;
        border-radius: 50%;
        margin-left: 20px;
    }
    .phone-notch-speaker {
        width: 40px;
        height: 4px;
        background-color: #4b5563;
        border-radius: 2px;
    }
    .phone-screen-container {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #faf5ff;
    }
    .phone-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    /* Pitchdeck Table of Contents Sidebar / selector list */
    .toc-item {
        background-color: #ffffff;
        border: 2px solid #28180b;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
        font-family: 'Outfit', 'Inter', sans-serif;
        font-weight: 700;
        color: #28180b;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;
    }
    .toc-item:hover {
        background-color: #fffbeb;
        transform: translate(-2px, -2px);
        box-shadow: 2px 2px 0px 0px #28180b;
    }
    .toc-item.active {
        background-color: #ffd275;
        transform: translate(-3px, -3px);
        box-shadow: 3px 3px 0px 0px #28180b;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation Hub Info
st.sidebar.markdown("""
<div style="text-align: center; padding: 1rem; border: 3px solid #28180b; box-shadow: 4px 4px 0px 0px #28180b; border-radius: 16px; background-color: #ffd275; margin-bottom: 1.5rem;">
    <h2 style="font-weight: 900; margin: 0; color: #28180b; font-family: 'Outfit';">🧊 BINGLE IR Deck</h2>
    <span style="font-size: 0.85rem; font-weight: bold; color: #28180b; font-family: 'Inter';">마음 냉장고 서비스 발표자료</span>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("### 🏆 깃허브 공식 저장소 정보")
st.sidebar.code("https://github.com/chaejun12/NP1_repo", language="text")
st.sidebar.info("💡 본 포털은 해당 GitHub 저장소와 실시간으로 동기화되어 Streamlit Cloud에서 글로벌 웹으로 제공됩니다.")

# Main app title banner
st.markdown("""
<div class="neo-title-banner">
    <h1 class="neo-title-text">🧊 BINGLE (마음 냉장고) 서비스 피치덱</h1>
    <p class="neo-subtitle-text">손그림 스타일의 감성 마음냉장고 웰니스 서비스 및 세부 사양 발표회</p>
</div>
""", unsafe_allow_html=True)

# Define Slide Data with exhaustive Korean manual descriptions
slide_data = {
    1: {
        "title": "🌟 01. 탄생 스토리 온보딩 (Story Onboarding)",
        "badge": "ONBOARDING STAGE",
        "badge_color": "#bae6fd",
        "description": "유저의 과열된 마음 상태를 치유하는 여정의 시작입니다. 앱 최초 구동 시 닫힌 냉장실 도어가 전면에 노출되며, '냉장실 문 열고 빙글이 구하기' 액션을 통해 문을 좌우 Y축 Y-axis로 활짝 여는 3D 스윙 애니메이션이 적용되었습니다.",
        "when": "앱 최초 진입 및 3D 냉장고 문 열기 버튼을 클릭했을 때 기동",
        "object": "3D Refrigerator Door (좌우 비대칭 양문 아크릴 프레임)",
        "engine": "React 18, CSS Y-rotation Transition, 로컬 스토리지 진단 플래그",
        "bullets": [
            "스토리 만화책: Stitch 감성 테마에 어우러지는 아늑한 4컷 만화 컷씬 시퀀스 구현",
            "동작 가속화: 3D 회전 물리효과를 주어 문이 부드럽고 웅장하게 밀려 열림",
            "초기 온도 표시: 문 표면의 온도 센서 LED가 붉은색 85°C(과열 상태)를 점화"
        ],
        "image_file": "app_screen_1_onboarding.png"
    },
    2: {
        "title": "🧊 02. 아늑한 냉각 조종석 홈 (Game Hub)",
        "badge": "MAIN CORE HUB",
        "badge_color": "#fed7aa",
        "description": "빙글이의 거처인 냉장실 3단 구조 대시보드입니다. 유저의 일상 뽀모도로 포커싱과 온도를 직관적으로 싱크하여, 집중하는 동안 열이 들어오고 휴식할 때 쿨링이 구동되는 게임 루프의 핵심 메인 로비 화면입니다.",
        "when": "온보딩 완수 후 메인 화면 노출 및 뽀모도로 타이머 작동 시작/종료 시점",
        "object": "Dashboard Level Engine, Stress Gauge, Real-time Temperature Clock",
        "engine": "Framer Motion Spring Vector Engine, Dynamic HSL Background Shaders",
        "bullets": [
            "뽀모도로 쿨링 메커니즘: 업무에 집중할 때 기온이 초당 2.5°C 오르고 빙글이가 땀 흘림",
            "경험치 동기화: 유저가 웰니스 집중을 무사히 마치면 XP 보너스 및 치유 식재료 드롭",
            "돔 케이스: 빙글이가 아늑한 반투명 얼음 돔 내부에서 수면/기쁨 리액션 수행"
        ],
        "image_file": "app_screen_2_home.png"
    },
    3: {
        "title": "🛍️ 03. 치유 식재료 창고 & 상점 (Pantry Warehouse)",
        "badge": "HEALING INVENTORY",
        "badge_color": "#a7f3d0",
        "description": "마음이 무너지거나 번아웃이 발생했을 때 처방할 수 있는 5대 웰니스 치유 간식 인벤토리 및 마켓입니다. 식재료를 누르는 순간 포물선을 비행하며 빙글이 입속으로 쏙 골인하여 냠냠 씹어먹는 물리 이펙트가 구현되어 있습니다.",
        "when": "선반 내 식재료 탭/클릭 시 포물선 비행 및 버스트 파티클 폭발 타이밍",
        "object": "5대 처방 아이템 (탄산 소화수, 자몽 비타민, 카카오 힐러, 멜론 젤리, 라벤더 우유)",
        "engine": "HTML5 Canvas Dynamic Particle Engine, Custom Hand-Drawn Food SVG",
        "bullets": [
            "탄산 소화수 💧: 기온 -15°C 급랭 및 불안 정서 해소 피드백 제공",
            "자몽 비타민 🍊: 무기력증을 극복하게 하며 보너스 경험치 +30 XP 적립",
            "카카오 힐러 🍫: 과열된 뇌를 즉각 냉각하여 완벽 적정 온도 12°C로 복구",
            "멜론 젤리 🍈 & 라벤더 우유 🥛: 정서 상처 극복 및 수면 케어 모드로 전환"
        ],
        "image_file": "app_screen_3_pantry.png"
    },
    4: {
        "title": "📝 04. 달력 성찰 일기 & 감정 통계 (Calendar Diary & Stats)",
        "badge": "TRACKER & ANALYTICS",
        "badge_color": "#fbcfe8",
        "description": "매일의 기분 척도와 텍스트 일기를 남기고 감정을 시각 통계로 분석받는 트래커 스크린입니다. 기록 완료 시 빈티지 폴라로이드 앨범 감성의 포스트카드 스티커가 수집되며, 스트레스 웰니스 온도 커브 차트가 함께 출력됩니다.",
        "when": "일기 입력 및 오늘의 기분 등록 후 분석 보고서가 빌드되는 타이밍",
        "object": "Stats Line Curve Graph, Sentiment gyro Analyzer, Polaroid Diary Array",
        "engine": "SVG Path Curve Generator, Dynamic Sentiment NLP Morpheme Dictionary",
        "bullets": [
            "포스트카드 수집: '힐링 숲의 숨결', '차가운 파도' 등 오늘의 마음 테마 일화 스티커 적립",
            "마음 온도 차트: 월간 스트레스 등락 지점과 쿨링 안정 구간을 세련된 커브로 렌더링",
            "자동 처방: 일기장 완성 시 불안/무기력 분석을 통해 [카카오 힐러 🍫] 인벤토리 자동 충전"
        ],
        "image_file": "app_screen_4_diary.png"
    },
    5: {
        "title": "🏃 05. GPS 연동 산책 지도 (Map Walk)",
        "badge": "BEHAVIOR ACTIVATION",
        "badge_color": "#ddd6fe",
        "description": "현대인의 신체 활동 활성화(Behavioral Activation)를 돕는 야외 산책용 스크린입니다. 모바일 기기의 하드웨어 센서 공명 상태를 보정하고, 유저의 걸음 수에 연계되어 보들보들한 점선 산책로 위를 아기자기하게 걷는 지도가 구현되어 있습니다.",
        "when": "야외 운동 모드가 켜지고 GPS 위성 매핑 및 걸음 수 변동이 감지될 때 실시간 구동",
        "object": "GPS calibration System, 3-Axis Gyro resonance, HTML5 Path Canvas",
        "engine": "HTML5 Canvas Dynamic Coordinate Path Line Tracer",
        "bullets": [
            "센서 정렬 연출: GPS 위성 신호 정렬, 자이로 중력 공명 바를 보여주어 첨단 감성 제공",
            "점선 가이드: 굵은 점선으로 그려지는 지도 위를 빙글이가 유저 보폭에 맞춰 이동",
            "마일스톤: 산들바람 고개(500보), 빙하 정상(1200보) 돌파 시 힐링 탄산수/비타민 드롭"
        ],
        "image_file": "app_screen_5_map.png"
    },
    6: {
        "title": "🌳 06. 마법의 숲 자연 명상 (Forest World)",
        "badge": "DEEP MINDFULNESS",
        "badge_color": "#cffafe",
        "description": "격앙되거나 복잡한 뇌파를 숲속의 바람소리와 심호흡 가이드를 통해 시원하게 식혀주는 명상 치유터입니다. 화면 중앙의 거대한 호흡 유도 코어가 들숨과 날숨 리듬에 맞춰 팽창 및 수축하여 깊은 정서적 안정을 유도합니다.",
        "when": "자연 ASMR 재생을 활성화하고 8초 윈도우 심호흡 트레이너가 작동할 때",
        "object": "Breathing Guide Circle Core, Nature Sound Synthesizer Node",
        "engine": "Web Audio API Spatial Sound Module, CSS Breath-Scale Animation",
        "bullets": [
            "ASMR 입체 공명: 산새 지저귐, 맑은 바람 소리 오디오 트랙 탑재로 입체 웰니스 구축",
            "호흡 가이드: 들숨(Inhale) 4초, 날숨(Exhale) 4초 주기에 맞춰 코어가 부드럽게 팽창/수축",
            "명상 열매: 심호흡 수련 5회 완수 시 기운이 100% 맑게 정화되며 [멜론 젤리 🍈] 처방"
        ],
        "image_file": "app_screen_6_forest.png"
    },
    7: {
        "title": "🤝 07. 이웃 냉장고 소셜 지원 (Neighbors Fridge)",
        "badge": "SOCIAL GUARDIAN",
        "badge_color": "#fef08a",
        "description": "이타적 소통과 협동 멘탈 수호를 결합한 '꽁꽁 가디언즈' 이웃 룸입니다. 스트레스로 녹아가고 있는 이웃 유저의 냉장고를 방문하여 맑은 서리 냉기를 불어넣거나 소화수를 뿌려주어 빙글이가 안전하게 회복할 수 있도록 서로 돕습니다.",
        "when": "소셜 이웃 맵에서 친구 냉장실 상태창을 조회하고 상호 지원 버튼을 누를 때 기동",
        "object": "Neighbor Fridge Compartment state, Frozen Guardian social controller",
        "engine": "Firebase RTDB Realtime Node Synchronization, Social Socket Binding",
        "bullets": [
            "상호 쿨링 연대: 서로의 냉장고에 시원한 탄산수를 선물하여 온도를 공동 하향 조율",
            "가디언즈 동맹: 친구 빙글이가 완전히 녹지 않도록(Melting 100% 임계 방지) 수호 임무 전개",
            "메탈 스킨 동화: 이웃 냉장고 방문 시 해당 친구가 선택한 유니크 테마 배경이 역동적으로 로드"
        ],
        "image_file": "app_screen_7_social.png"
    }
}

# Streamlit Tabs
tab1, tab2, tab3 = st.tabs([
    "📱 서비스 피치덱 (Pitch Deck & Phone View)", 
    "🎮 실시간 인터랙티브 (Interactive Play)", 
    "🚀 GitHub 리포지토리 & 배포 센터"
])

with tab1:
    col_left, col_right = st.columns([1.2, 1.0])
    
    with col_left:
        st.markdown("### 📋 피치덱 발표 목차 (TOC)")
        st.markdown("발표할 서비스 화면을 선택하시면 오른쪽에 **실제 구동 모바일 프레임**과 세부 사양서가 실시간 연동됩니다.")
        
        # State management for active slide
        if 'active_slide' not in st.session_state:
            st.session_state.active_slide = 1
            
        # Draw interactive list of slides
        for num, data in slide_data.items():
            is_active = st.session_state.active_slide == num
            active_class = "active" if is_active else ""
            
            # Custom clickable list item rendering
            toc_html = f"""
            <div class="toc-item {active_class}" onclick="window.parent.postMessage({{type: 'select_slide', slide: {num}}}, '*')">
                <span>{data['title']}</span>
                <span style="font-size: 0.8rem; background-color: #28180b; color: white; padding: 2px 8px; border-radius: 20px;">Slide {num}</span>
            </div>
            """
            st.markdown(toc_html, unsafe_allow_html=True)
            
            # Simple button fallback for streamlits native reactivity
            if st.button(f"🔍 Slide {num} 상세 보기", key=f"btn_slide_{num}"):
                st.session_state.active_slide = num
                st.rerun()

        # Selected slide information display
        curr_slide = st.session_state.active_slide
        data = slide_data[curr_slide]
        
        st.markdown("---")
        st.markdown(f"""
        <div class="neo-card" style="background-color: #ffffff;">
            <span class="neo-badge" style="background-color: {data['badge_color']};">{data['badge']}</span>
            <h3 class="neo-header" style="margin-top: 0; font-size: 1.4rem;">{data['title']}</h3>
            <p style="font-size: 0.95rem; font-weight: 600; color: #4b5563; line-height: 1.6; margin-bottom: 1rem;">
                {data['description']}
            </p>
            
            <h4 class="neo-header" style="font-size: 1.1rem; border-bottom: 2px solid #28180b; padding-bottom: 4px; margin-top: 1.5rem;">⚙️ 세부 연동 사양</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; color: #28180b; font-weight: bold; margin-top: 0.5rem;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9fafb; width: 30%;"><b>동작 기동 상황<br>(When)</b></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{data['when']}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9fafb;"><b>동작 대상 객체<br>(Object)</b></td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace;">{data['object']}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9fafb;"><b>사용 기술/엔진<br>(Software Engine)</b></td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; color: #0284c7;">{data['engine']}</td>
                </tr>
            </table>
            
            <h4 class="neo-header" style="font-size: 1.1rem; border-bottom: 2px solid #28180b; padding-bottom: 4px; margin-top: 1.5rem;">⭐ 핵심 기획 포인트</h4>
            <ul style="font-size: 0.88rem; font-weight: 600; color: #374151; padding-left: 1.2rem; margin-top: 0.5rem;">
                {"".join([f'<li style="margin-bottom: 6px;">{b}</li>' for b in data['bullets']])}
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col_right:
        st.markdown("<h3 style='text-align: center; font-family: Outfit; font-weight: 900; color: #28180b;'>📱 BINGLE 실시간 폰 뷰어</h3>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; font-size: 0.85rem; color: #6b7280; font-weight: 600; margin-top: -10px;'>우리가 실제 구현한 반응형 웹 서비스의 모바일 구동 화면입니다</p>", unsafe_allow_html=True)
        
        curr_slide = st.session_state.active_slide
        img_name = slide_data[curr_slide]["image_file"]
        
        # Load local screenshot
        local_img_path = os.path.join(os.getcwd(), img_name)
        img_base64 = get_image_base64(local_img_path)
        
        if img_base64:
            st.markdown(f"""
            <div class="phone-mockup-wrapper">
                <div class="phone-mockup">
                    <div class="phone-notch">
                        <div class="phone-notch-speaker"></div>
                        <div class="phone-notch-camera"></div>
                    </div>
                    <div class="phone-screen-container">
                        <img class="phone-image" src="data:image/png;base64,{img_base64}" alt="Bingle App Screen" />
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.warning(f"⚠️ 실제 서비스 모바일 캡처본 '{img_name}' 파일을 불러올 수 없습니다. 캡처 프로세스를 점검해주세요.")

with tab2:
    st.markdown("### 🎮 실시간 인터랙티브 발표자료 (Unified Interactive Play)")
    st.markdown("아래 내장 캔버스에서 직접 슬라이드를 넘기거나 버튼들을 클릭해 냠냠 간식 먹이기, 3D 문 열기, 뽀모도로 타이머 작동, 김서림 유리 문지르기, 뇌파 ASMR 소리 듣기 인터랙티브 시뮬레이터를 체험하세요!")
    
    html_file_path = "bingle_presentation.html"
    if os.path.exists(html_file_path):
        with open(html_file_path, "r", encoding="utf-8") as f:
            presentation_html = f.read()
        components.html(presentation_html, height=850, scrolling=True)
    else:
        st.error("⚠️ 'bingle_presentation.html' 파일이 루트 디렉토리에 존재하지 않습니다.")

with tab3:
    st.markdown(f"""
    <div class="neo-card" style="background-color: #eff6ff; border-color: #3b82f6;">
        <span class="neo-badge" style="background-color: #3b82f6; color: white;">REPOSITORY & DEPLOY</span>
        <h3 class="neo-header" style="margin-top: 0; color: #1e3a8a;">🚀 GitHub 공식 연결 저장소 및 Streamlit Cloud 배포 안내</h3>
        <p style="font-size: 0.95rem; color: #1e3a8a; font-weight: 600; line-height: 1.6;">
            현재 작성 완료된 <b>모바일 피치덱 포털</b>을 지정해주신 GitHub 저장소(<code>chaejun12/NP1_repo</code>)에 직접 푸시하고 Streamlit에 배포하는 터미널 프로토콜입니다.
        </p>
        <hr style="border-top: 1px solid #3b82f6; opacity: 0.3; margin: 1rem 0;">
        <h4 class="neo-header" style="font-size: 1.1rem; color: #1e3a8a; margin-top: 0.5rem;">📥 1. 로컬 저장소 원격 연동 및 커밋 명령어</h4>
        <pre style="background-color: #1e293b; padding: 1rem; border-radius: 12px; font-family: monospace; font-size: 0.85rem; color: #f8fafc; font-weight: normal; line-height: 1.5; overflow-x: auto;">
# 1. 원격 주소를 chaejun12/NP1_repo 로 명확히 지정
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/chaejun12/NP1_repo.git

# 2. 변경된 스크린샷과 수정한 스트림릿 코드 일체 스테이징
git add .

# 3. 커밋 생성
git commit -m "feat: Update Pitch Deck split screen layout with actual phone frame mockup and chaejun12 repo"

# 4. GitHub 저장소로 강제 푸시 (저장소와 상태 강제 싱크)
git push -u origin main --force
        </pre>
        <h4 class="neo-header" style="font-size: 1.1rem; color: #1e3a8a; margin-top: 1.5rem;">🌐 2. Streamlit Cloud 라이브 배포 프로세스</h4>
        <ol style="font-size: 0.88rem; color: #1e3a8a; font-weight: 700; line-height: 1.8;">
            <li><a href="https://share.streamlit.io" target="_blank" style="color: #2563eb; text-decoration: underline;">Streamlit Community Cloud</a>에 접속 후 GitHub 계정으로 가입/로그인</li>
            <li>대시보드 페이지 우측 상단의 <b>[New app]</b> 버튼 클릭</li>
            <li><b>Repository</b> 입력칸에 <code>chaejun12/NP1_repo</code> 선택</li>
            <li><b>Branch</b>에 <code>main</code> 설정</li>
            <li><b>Main file path</b>에 <code>streamlit_app.py</code> 기입 후 <b>[Deploy!]</b> 클릭</li>
            <li>빌드가 완료되면 고유 <code>.streamlit.app</code> 주소가 생성되어, 전 세계 누구나 웹 모바일 뷰어와 인터랙티브 데모를 실시간 조회할 수 있습니다!</li>
        </ol>
    </div>
    """, unsafe_allow_html=True)
