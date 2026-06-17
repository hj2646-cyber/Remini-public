"""Remini 시스템 흐름 다이어그램 (발표용 PNG 생성)."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib.font_manager import FontProperties

FP = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
FP_B = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc')

fig, ax = plt.subplots(figsize=(18, 11), dpi=160)
ax.set_xlim(0, 18)
ax.set_ylim(0, 11)
ax.axis('off')

C_USER = ('#FFE0B2', '#E65100')
C_PROC = ('#E1F5FE', '#01579B')
C_LLM  = ('#F3E5F5', '#4A148C')
C_DB   = ('#FFF59D', '#F57F17')
C_CARE = ('#C8E6C9', '#1B5E20')
C_DANG = ('#FFCDD2', '#B71C1C')


def box(x, y, w, h, text, color, fs=11, bold=False):
    fc, ec = color
    fp = FP_B if bold else FP
    p = FancyBboxPatch((x, y), w, h,
                       boxstyle="round,pad=0.04,rounding_size=0.18",
                       fc=fc, ec=ec, lw=2.0)
    ax.add_patch(p)
    ax.text(x + w / 2, y + h / 2, text, ha='center', va='center',
            fontsize=fs, color=ec, fontproperties=fp)


def label(x, y, text, fs=10, color='#37474F', bold=False, bg='white', ha='center', style='normal'):
    fp = FP_B if bold else FP
    bbox = dict(boxstyle='round,pad=0.25', fc=bg, ec='none', alpha=0.95) if bg else None
    ax.text(x, y, text, ha=ha, va='center', fontsize=fs,
            color=color, fontproperties=fp, bbox=bbox, style=style)


def arrow(x1, y1, x2, y2, color='#37474F', lw=1.8, rad=0):
    a = FancyArrowPatch((x1, y1), (x2, y2),
                        arrowstyle='-|>', color=color, lw=lw,
                        mutation_scale=18,
                        connectionstyle=f"arc3,rad={rad}")
    ax.add_patch(a)


# ==== 제목 ====
ax.text(9, 10.55, 'Remini 시스템 흐름', fontsize=22, ha='center',
        color='#263238', fontproperties=FP_B)
ax.text(9, 10.15,
        '환자 발화 → STT 1회 → 메인 응답 + 부가 처리 3갈래로 fan-out',
        fontsize=11, ha='center', color='#607D8B', fontproperties=FP, style='italic')

# ==== TOP: 메인 응답 흐름 ====
y_top = 8.6
box(0.3, y_top, 1.9, 0.85, '환자 UI\n(태블릿)', C_USER, fs=10, bold=True)
box(2.6, y_top, 1.9, 0.85, '환자 코드\n입력', C_USER, fs=10)
box(4.9, y_top, 1.9, 0.85, 'AI 첫 발화\n(인사)', C_PROC, fs=10)
box(7.2, y_top, 1.9, 0.85, '환자 음성\n발화', C_USER, fs=10)
box(9.5, y_top, 1.9, 0.85, 'STT\n(음성→텍스트)', C_PROC, fs=10, bold=True)
box(11.8, y_top, 1.9, 0.85, 'LLM 추론', C_LLM, fs=11, bold=True)
box(14.1, y_top, 1.9, 0.85, 'TTS\n(텍스트→음성)', C_PROC, fs=10, bold=True)
box(16.4, y_top, 1.5, 0.85, '환자 UI\n재생', C_USER, fs=10, bold=True)

for x1 in [2.2, 4.5, 6.8, 9.1, 11.4, 13.7, 16.0]:
    arrow(x1, y_top + 0.42, x1 + 0.4, y_top + 0.42)

# ==== DB 박스 ====
db_x, db_y = 11.4, 6.3
box(db_x, db_y, 2.7, 1.3,
    'DB (이원화 조회)\n① KG  (1순위)\n② Vector DB (2순위)',
    C_DB, fs=10.5, bold=True)

arrow(12.5, y_top, 12.5, db_y + 1.3, color=C_DB[1], lw=2.0)
arrow(13.0, db_y + 1.3, 13.0, y_top, color=C_LLM[1], lw=2.0)
label(12.75, (y_top + db_y + 1.3) / 2 + 0.05, '조회', fs=10, bold=True)

# ==== STT 분기점 ====
fanout_x = 10.45
arrow(fanout_x, y_top, fanout_x, 4.6, color='#37474F', lw=2.2)
ax.text(fanout_x + 0.15, (y_top + 4.6) / 2 + 0.1,
        'STT 결과\nfan-out',
        fontsize=10, color='#263238', va='center', fontproperties=FP_B,
        bbox=dict(boxstyle='round,pad=0.3', fc='#FFF9C4', ec='#F57F17', lw=1.2))

# ==== BOT: STT 분기 3갈래 ====
# 분기 1
y1 = 4.0
box(7.4, y1, 2.5, 0.85, '대화기록 저장', C_PROC, fs=10.5)
box(3.6, y1, 2.7, 0.85, '보호자 앱\n(대화 타임라인)', C_CARE, fs=10.5, bold=True)
arrow(fanout_x, y1 + 0.42, 9.9, y1 + 0.42)
arrow(7.4, y1 + 0.42, 6.3, y1 + 0.42)

# 분기 2
y2 = 2.7
box(7.4, y2, 2.5, 0.85, '새 정보 추출\n(entity 발견)', C_PROC, fs=10)
box(3.6, y2, 2.7, 0.85, '보호자 앱\n(승인 요청)', C_CARE, fs=10.5, bold=True)
arrow(fanout_x, y2 + 0.42, 9.9, y2 + 0.42)
arrow(7.4, y2 + 0.42, 6.3, y2 + 0.42)

# 승인 → DB
arrow(5.0, y2 + 0.85, db_x + 0.4, db_y, color=C_DB[1], lw=2.0, rad=-0.25)
label(8.5, 5.5, '승인 시 저장', fs=10, color=C_DB[1], bold=True, bg='white')

# 분기 3
y3 = 1.3
box(7.4, y3, 2.5, 0.85, '위험 발화 필터', C_DANG, fs=10.5, bold=True)
arrow(fanout_x, y3 + 0.42, 9.9, y3 + 0.42)

box(3.6, y3 + 0.55, 2.7, 0.7, '보호자 알람', C_DANG, fs=10.5, bold=True)
box(3.6, y3 - 0.55, 2.7, 0.7, 'AI 안전 응답\n(LLM 우회)', C_DANG, fs=9.5, bold=True)
arrow(7.4, y3 + 0.6, 6.3, y3 + 0.9, color=C_DANG[1], lw=1.8)
arrow(7.4, y3 + 0.25, 6.3, y3 - 0.2, color=C_DANG[1], lw=1.8)
label(7.0, y3 + 1.35, '위험', fs=9.5, color=C_DANG[1], bold=True, bg='white')

# AI 안전 응답 → 환자 UI
arrow(3.6, y3 - 0.2, 0.6, y3 + 0.7, color=C_DANG[1], lw=1.5, rad=0.35)
label(1.7, y3 + 0.1, '환자 UI로\n안전 음성 재생',
      fs=8.5, color=C_DANG[1], bg=None, style='italic')

# ==== 섹션 라벨 ====
ax.text(0.3, 5.7, '【 메인 응답 흐름 】',
        fontsize=11, color='#263238', fontproperties=FP_B,
        bbox=dict(boxstyle='round,pad=0.35', fc='#ECEFF1', ec='#90A4AE'))
ax.text(0.3, 5.0, '【 STT 부가 처리 (병렬 3갈래) 】',
        fontsize=11, color='#263238', fontproperties=FP_B,
        bbox=dict(boxstyle='round,pad=0.35', fc='#ECEFF1', ec='#90A4AE'))

# ==== 범례 ====
legend_y = 0.15
items = [('환자', C_USER), ('처리 노드', C_PROC), ('LLM', C_LLM),
         ('DB', C_DB), ('보호자 앱', C_CARE), ('위험 처리', C_DANG)]
lx = 0.3
for name, (fc, ec) in items:
    p = FancyBboxPatch((lx, legend_y), 0.4, 0.35,
                       boxstyle="round,pad=0.02,rounding_size=0.05",
                       fc=fc, ec=ec, lw=1.5)
    ax.add_patch(p)
    ax.text(lx + 0.5, legend_y + 0.18, name, fontsize=9.5,
            color='#263238', va='center', fontproperties=FP)
    lx += 2.4

out = '/home/oem/바탕화면/학부연구생종합설계프로젝트/Remini/docs/presentation/slides/system_flow.png'
plt.savefig(out, dpi=160, bbox_inches='tight', facecolor='white')
print(f'saved: {out}')
