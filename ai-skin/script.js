(function () {
  const $ = (id) => document.getElementById(id);
  const startBtn = $('vrmtStartCameraBtn');
  const captureBtn = $('vrmtCaptureBtn');
  const video = $('vrmtCameraVideo');
  const canvas = $('vrmtSnapshotCanvas');
  const statusEl = $('vrmtStatus');
  const analysis = $('vrmtAnalysis');
  const guide = $('vrmtFaceGuide');
  const modePanel = $('vrmtModePanel');
  const premiumControls = $('vrmtPremiumControls');
  let premiumPanel = null;
  let premiumConfirm = null;
  let premiumQuality = null;
  let premiumAnalyzeBtn = null;
  let retakeBtn = null;
  let qualityCheckBtn = null;
  let premiumReportBtn = null;
  let qrScanStream = null;
  let qrScanTimer = null;

  const premiumAccessCode = 'BUSANBLUE';
  let premiumUnlocked = false;
  const supported = ['ko', 'en', 'vi', 'ja', 'jp', 'zh', 'cn', 'ar'];
  const medicalSafetyNotice = '본 리포트는 의료 진단이 아닙니다. 카메라 이미지 기반의 비의료적 피부 컨디션 참고 자료이며, 질병의 진단, 치료, 예방 또는 의료적 판단을 제공하지 않습니다. 최종 진료 및 치료 판단은 의료기관 상담을 통해 이루어져야 합니다.';
  const privacyNotice = '촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다. 기본 설정에서는 장기 저장하지 않으며, 상담 또는 이메일 리포트 수신을 신청하는 경우 별도 동의가 필요합니다.';
  const recentCaptureKey = 'vrmtAiSkinRecentFreeCapture';

  let stream = null;
  let currentLanguage = 'ko';
  let lastAnalysis = null;
  let lastReportMode = null;
  let lastErrorReport = null;
  let pendingPremiumImage = null;
  let pendingPremiumFreeAnalysis = null;
  let qualityReady = false;

  const translations = {
    ko: {
      title: 'AI 피부 분석 & 케어 컨시어지',
      subtitle: '프리미엄 K-뷰티 · 메디컬 트래블 케어를 위한 AI 참고 분석',
      badgeAi: 'AI 참고 분석',
      badgeNoStore: '사진 저장 없음',
      badgeNotMedical: '의료 진단 아님',
      badgeKBeauty: 'K-뷰티 케어 제안',
      badgeConsult: '전문 상담 연계 가능',
      guide: '카메라를 시작한 뒤 얼굴을 가이드에 맞추고 AI 판별 촬영을 눌러 주세요.',
      premiumGuide: '밝은 곳에서 정면을 바라보고 촬영해주세요. 촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다.',
      startBtn: '카메라 시작',
      captureBtn: 'AI 판별 촬영',
      premiumCaptureBtn: '얼굴 사진 촬영',
      captureLoading: 'AI가 이미지를 분석 중입니다...',
      statusInit: '카메라를 시작한 뒤 얼굴을 가이드에 맞추고 AI 판별 촬영을 눌러 주세요.',
      premiumStatusInit: 'Premium Access 확인 완료: 방금 촬영한 사진이 있으면 새 촬영 없이 프리미엄 리포트를 생성합니다.',
      statusCameraOn: '카메라가 시작되었습니다. 가이드에 맞춘 뒤 촬영해 주세요.',
      statusAnalyzing: 'AI가 이미지를 분석 중입니다...',
      statusDone: 'AI 분석이 완료되었습니다.',
      statusNeedCamera: '먼저 카메라를 시작해 주세요.',
      statusQualityReady: '사진 품질 확인이 완료되었습니다. 안내 확인 후 프리미엄 분석을 시작할 수 있습니다.',
      statusInvalidPremium: '유효하지 않은 프리미엄 주소입니다. 무료 AI 피부 분석으로 이용할 수 있습니다.',
      errNoCamera: '이 브라우저는 카메라를 지원하지 않습니다.',
      errCameraPermission: '카메라 권한을 확인해 주세요.',
      errServer: '서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      errApiKey: 'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.',
      errQuota: 'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.',
      errImageFormat: '이미지 형식이 올바르지 않습니다. 다시 촬영해 주세요.',
      errImageSize: '이미지 용량이 너무 큽니다. 카메라를 다시 시작하고 재시도해 주세요.',
      errAnalyze: '분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      reportTitle: 'AI 피부 분석 리포트',
      reportDesc: '촬영 후 분석 리포트가 카드 형식으로 표시됩니다.',
      premiumReportTitle: '프리미엄 AI K-뷰티 컨시어지 리포트',
      skinSummary: '피부 컨디션 요약',
      imageQuality: '이미지 품질',
      tone: '피부톤 참고',
      redness: '붉은기 참고',
      moisture: '수분/건조 참고',
      carePriority: '케어 우선순위',
      productDirection: '추천 제품 방향',
      consult: '전문 상담 참고 안내',
      devJson: '개발자용 JSON 보기',
      languageNotice: '분석 결과 본문은 촬영 당시 선택된 언어로 생성됩니다. 다른 언어의 결과 본문이 필요하면 해당 언어를 선택한 뒤 다시 촬영해 주세요.',
      requestFailed: '요청 실패',
    },
    en: {
      title: 'AI Skin Analysis & Care Concierge',
      subtitle: 'AI reference insights for premium K-beauty and medical-travel care',
      badgeAi: 'AI reference analysis',
      badgeNoStore: 'No photo storage',
      badgeNotMedical: 'Not a medical diagnosis',
      badgeKBeauty: 'K-beauty care guidance',
      badgeConsult: 'Professional consultation linkage',
      guide: 'Start the camera, align your face in the guide, then tap AI Capture.',
      premiumGuide: 'Take the photo from the front in a bright place. The image is used only as reference material for the skin condition report.',
      startBtn: 'Start Camera',
      captureBtn: 'AI Capture',
      premiumCaptureBtn: 'Capture Face Photo',
      captureLoading: 'AI is analyzing the image...',
      statusInit: 'Start the camera, align your face in the guide, then tap AI Capture.',
      premiumStatusInit: 'Premium Access confirmed: if a recent photo exists, the premium report is generated without another capture.',
      statusCameraOn: 'Camera started. Align to the guide and capture.',
      statusAnalyzing: 'AI is analyzing the image...',
      statusDone: 'AI analysis is complete.',
      statusNeedCamera: 'Please start the camera first.',
      statusQualityReady: 'Photo quality check is complete. Confirm the notice to start the premium analysis.',
      statusInvalidPremium: 'This premium link is not valid. You can continue with the free AI skin analysis.',
      errNoCamera: 'This browser does not support camera access.',
      errCameraPermission: 'Please check camera permissions.',
      errServer: 'Server communication failed. Please try again later.',
      errApiKey: 'AI analysis server setup is not complete yet. Please contact the administrator.',
      errQuota: 'AI analysis server usage is temporarily limited. Please try again after administrator review.',
      errImageFormat: 'Invalid image format. Please capture again.',
      errImageSize: 'Image is too large. Restart camera and try again.',
      errAnalyze: 'Analysis request failed. Please try again later.',
      reportTitle: 'AI Skin Analysis Report',
      reportDesc: 'Your analysis report will appear here after capture.',
      premiumReportTitle: 'Premium AI K-Beauty Concierge Report',
      skinSummary: 'Skin condition summary',
      imageQuality: 'Image quality',
      tone: 'Skin tone reference',
      redness: 'Redness reference',
      moisture: 'Moisture/Dryness reference',
      carePriority: 'Care priority',
      productDirection: 'Recommended product direction',
      consult: 'Professional consultation reference',
      devJson: 'Developer JSON',
      languageNotice: 'The analysis content is generated in the language selected at the time of capture. To receive the full report in another language, select that language and capture again.',
      requestFailed: 'Request failed',
    },
  };
  Object.assign(translations.ko, { boothEyebrow:'오프라인 확장 모델', boothTitle:'프라이버시 보호형 AI 피부분석 뷰티 부스', boothDesc:'찜질방, 스파, 골프장 락커존에 적합한 AI 피부 관심도 분석 · K-뷰티 제품 추천 · 자동판매 · 상담 연결 시스템입니다.', boothNotice:'본 서비스는 의료 진단이 아닌 참고용 피부 관심도 분석 및 K-뷰티 상담 보조 서비스입니다.', boothButton:'부스형 사업 모델 보기', boothCaption:'AI 콘셉트 이미지 · 실제 설치 전 사용 시나리오 설명용', premiumAccessConfirmed:'Premium Access 확인 완료', premiumPanelTitle:'부산 굿즈 구매 고객 전용 AI K-뷰티 컨시어지 리포트', premiumPanelDesc:'카메라로 얼굴 사진을 촬영하면 무료 분석보다 자세한 피부 컨디션 참고 리포트, K-뷰티 루틴, 제품 카테고리, 한국 상담 준비 체크리스트를 확인할 수 있습니다.', privacyNotice:'촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다. 기본 설정에서는 장기 저장하지 않으며, 상담 또는 이메일 리포트 수신을 신청하는 경우 별도 동의가 필요합니다.', premiumUnlockSuccess:'BUSANBLUE 프리미엄 인증 성공', premiumUnlockDesc:'방금 촬영한 사진과 무료 분석 결과가 이 브라우저 세션에 있으면 새로 사진을 찍지 않고 프리미엄 리포트를 생성합니다.', premiumStep1:'1. 무료 분석 완료', premiumStep2:'2. 굿즈 QR 인증', premiumStep3:'3. 기존 사진 확인', premiumStep4:'4. 프리미엄 리포트 생성', premiumConfirmText:'본 서비스가 의료 진단이 아닌 피부 컨디션 참고 리포트임을 확인했습니다.', retakeBtn:'다시 촬영', qualityCheckBtn:'사진 품질 확인', premiumAnalyzeStart:'프리미엄 분석 시작', premiumReportView:'프리미엄 리포트 보기', qualityChecking:'사진 품질 확인 중...', qualityCenter:'얼굴이 화면 중앙에 있는지', qualityLighting:'조명이 너무 어둡지 않은지', qualityDistance:'얼굴이 너무 멀지 않은지', qualityBlur:'흔들림이 심하지 않은지', qualityMask:'마스크나 선글라스가 없는지', qualityWaiting:'확인 중입니다. 잠시만 기다려 주세요.', retakeLong:'다시 촬영하기', qualityGood:'사진 품질: 양호', premiumCanGenerate:'프리미엄 리포트를 생성할 수 있습니다.', retakeForBetter:'더 안정적인 리포트를 위해 다시 촬영해주세요.', premiumGenerating:'프리미엄 리포트 생성 중...', premiumLockTitle:'프리미엄 리포트 잠금', premiumLockDesc:'방금 촬영한 사진을 기반으로 더 자세한 AI K-뷰티 컨시어지 리포트를 확인할 수 있습니다. 부산 굿즈 안내서의 QR을 스캔하면 프리미엄 리포트가 열립니다.', scanGoodsQr:'굿즈 QR 스캔하기', premiumReportIntro:'무료 분석보다 자세한 피부 컨디션 참고 리포트, K-뷰티 루틴, 제품 카테고리, 한국 상담 준비 체크리스트입니다.', overallScore:'종합 피부 컨디션 점수', sevenScores:'7개 하위 점수', topConcerns:'피부 고민 TOP 5', zoneObservation:'얼굴 부위별 관찰', morningRoutine:'아침 K-뷰티 루틴', eveningRoutine:'저녁 K-뷰티 루틴', weeklyCare:'주간 케어 루틴', productCategories:'추천 제품 카테고리', consultChecklist:'한국 K-뷰티·의료관광 상담 준비 체크리스트', kBeautyConsult:'K-뷰티 상담 신청', medicalTourConsult:'한국 의료관광 상담 신청', emailReport:'리포트 이메일로 받기', backHome:'VR MEDI TOUR 홈으로 돌아가기', hydration:'수분감 추정', oilBalance:'유분 밸런스', texture:'피부결 균일도', pores:'모공 가시성', redSensitive:'붉은기·민감 신호', toneEvenness:'톤 균일도', glow:'광채·생기', forehead:'이마', cheeks:'양 볼', nose:'코 주변', mouthArea:'입가', chin:'턱', eyeArea:'눈가', needFreeCapture:'프리미엄 리포트를 생성하려면 먼저 무료 피부 분석 촬영이 필요합니다.', needFreeCaptureGuide:'무료 분석을 완료한 뒤 굿즈 안내서 QR을 다시 스캔해 주세요.', premiumOpened:'부산 굿즈 구매 고객 전용 프리미엄 리포트가 열렸습니다.', premiumViewHint:'프리미엄 리포트 보기 버튼을 누르면 새로 사진을 찍지 않고 무료 분석 결과를 기반으로 상세 리포트를 생성합니다.', qrTitle:'굿즈 안내서 QR을 스캔해 주세요', qrDesc:'여권케이스 또는 굿즈 안내서에 인쇄된 QR을 카메라에 비추면 프리미엄 AI K-뷰티 컨시어지 리포트가 열립니다.', qrReady:'QR 스캔 시작 버튼을 눌러 주세요.', qrStart:'QR 스캔 시작', qrCancel:'스캔 취소', qrManualSummary:'QR이 인식되지 않나요? Access Code 직접 입력', qrManualPlaceholder:'Access Code', confirmBtn:'확인', qrInvalid:'유효하지 않은 QR입니다. 굿즈 안내서의 QR을 다시 확인해 주세요.', qrUnsupported:'이 브라우저에서는 자동 QR 인식이 제한됩니다. 하단의 Access Code 직접 입력을 이용해 주세요.', qrCameraError:'QR 스캔 카메라를 시작할 수 없습니다. 카메라 권한을 확인하거나 Access Code 직접 입력을 이용해 주세요.' });
  translations.en = { ...translations.en, boothEyebrow:'Offline Expansion Model', boothTitle:'Privacy-protective AI skin analysis beauty booth', boothDesc:'A system for spas, locker zones, product suggestions, vending, and consultation connection.', boothNotice:'This service is not a medical diagnosis; it is reference analysis and K-beauty consultation support.', boothButton:'View booth business model', boothCaption:'AI concept image · scenario explanation', premiumAccessConfirmed:'Premium Access confirmed', premiumPanelTitle:'AI K-Beauty Concierge Report for Busan goods customers', premiumPanelDesc:'View a more detailed skin condition reference report, K-beauty routine, product categories, and Korea consultation checklist.', privacyNotice:'Captured images are used only as reference material for the skin condition report and are not stored long term by default.', premiumUnlockSuccess:'BUSANBLUE premium authentication successful', premiumUnlockDesc:'If the photo and free analysis are available, the premium report is generated without a new photo.', premiumStep1:'1. Free analysis done', premiumStep2:'2. Goods QR verified', premiumStep3:'3. Existing photo checked', premiumStep4:'4. Premium report', premiumConfirmText:'I confirm this is a skin condition reference report, not a medical diagnosis.', retakeBtn:'Retake', qualityCheckBtn:'Photo quality check', premiumAnalyzeStart:'Start premium analysis', premiumReportView:'View premium report', qualityChecking:'Checking photo quality...', qualityCenter:'Face is centered', qualityLighting:'Lighting is not too dark', qualityDistance:'Face is not too far', qualityBlur:'Motion blur is not severe', qualityMask:'No mask or sunglasses', qualityWaiting:'Checking. Please wait.', retakeLong:'Retake photo', qualityGood:'Photo quality: Good', premiumCanGenerate:'The premium report can be generated.', retakeForBetter:'Retake for a more stable report if needed.', premiumGenerating:'Generating premium report...', premiumLockTitle:'Premium report locked', premiumLockDesc:'Based on the photo you just captured, you can view a more detailed AI K-beauty concierge report. Scan the QR in the Busan goods guide to open it.', scanGoodsQr:'Scan goods QR', premiumReportIntro:'A more detailed skin condition reference report, K-beauty routine, product categories, and Korea consultation checklist.', overallScore:'Overall skin condition score', sevenScores:'7 sub-scores', topConcerns:'Top 5 skin concerns', zoneObservation:'Face-zone observations', morningRoutine:'Morning K-beauty routine', eveningRoutine:'Evening K-beauty routine', weeklyCare:'Weekly care routine', productCategories:'Recommended product categories', consultChecklist:'K-beauty / medical tourism consultation checklist', kBeautyConsult:'Request K-beauty consultation', medicalTourConsult:'Request Korea medical tourism consultation', emailReport:'Receive report by email', backHome:'Back to VR MEDI TOUR home', hydration:'Estimated hydration', oilBalance:'Oil balance', texture:'Texture evenness', pores:'Pore visibility', redSensitive:'Redness/sensitivity signals', toneEvenness:'Tone evenness', glow:'Glow/vitality', forehead:'Forehead', cheeks:'Cheeks', nose:'Nose area', mouthArea:'Mouth area', chin:'Chin', eyeArea:'Eye area', needFreeCapture:'A free skin-analysis capture is required before generating the premium report.', needFreeCaptureGuide:'Complete the free analysis first, then scan the goods-guide QR again.', premiumOpened:'The premium report for Busan goods customers is open.', premiumViewHint:'Tap View premium report to generate a detailed report without taking a new photo.', qrTitle:'Scan the goods-guide QR', qrDesc:'Point the camera at the QR printed on the passport case or goods guide to open the premium report.', qrReady:'Tap Start QR scan.', qrStart:'Start QR scan', qrCancel:'Cancel scan', qrManualSummary:'QR not recognized? Enter Access Code', qrManualPlaceholder:'Access Code', confirmBtn:'Confirm', qrInvalid:'Invalid QR. Please check the QR in the goods guide again.', qrUnsupported:'Automatic QR recognition is limited in this browser. Please use Access Code entry below.', qrCameraError:'Could not start the QR camera. Check camera permission or use Access Code entry.' };
  translations.vi = { ...translations.en, title:'Phân tích da AI & Concierge chăm sóc', subtitle:'Phân tích tham khảo AI cho K-beauty cao cấp và chăm sóc du lịch y tế', badgeAi:'Phân tích tham khảo AI', badgeNoStore:'Không lưu ảnh', badgeNotMedical:'Không phải chẩn đoán y tế', badgeKBeauty:'Hướng dẫn chăm sóc K-beauty', badgeConsult:'Có thể kết nối tư vấn', guide:'Bật camera, căn mặt theo khung rồi nhấn Chụp AI.', startBtn:'Bật camera', captureBtn:'Chụp AI', reportTitle:'Báo cáo phân tích da AI', reportDesc:'Báo cáo sẽ hiển thị dạng thẻ sau khi chụp.', boothEyebrow:'Mô hình mở rộng offline', boothTitle:'Booth phân tích da AI bảo vệ riêng tư', boothButton:'Xem mô hình booth', premiumAccessConfirmed:'Xác nhận Premium Access', premiumPanelTitle:'Báo cáo AI K-Beauty Concierge dành cho khách mua quà Busan', premiumAnalyzeStart:'Bắt đầu phân tích Premium', qualityCheckBtn:'Kiểm tra chất lượng ảnh', overallScore:'Điểm tổng thể tình trạng da', scanGoodsQr:'Quét QR quà tặng', premiumReportView:'Xem báo cáo Premium', qrTitle:'Vui lòng quét QR trong hướng dẫn quà tặng', qrStart:'Bắt đầu quét QR', qrCancel:'Hủy quét', qrInvalid:'QR không hợp lệ. Vui lòng kiểm tra lại QR trong hướng dẫn quà tặng.' };
  translations.ja = { ...translations.en, title:'AI肌分析＆ケアコンシェルジュ', subtitle:'プレミアムKビューティー・医療旅行ケアのためのAI参考分析', badgeAi:'AI参考分析', badgeNoStore:'写真保存なし', badgeNotMedical:'医療診断ではありません', badgeKBeauty:'Kビューティーケア案内', badgeConsult:'専門相談連携可能', guide:'カメラを開始し、顔をガイドに合わせてAI撮影を押してください。', startBtn:'カメラ開始', captureBtn:'AI判定撮影', reportTitle:'AI肌分析レポート', reportDesc:'撮影後、分析レポートがカード形式で表示されます。', boothEyebrow:'オフライン拡張モデル', boothTitle:'プライバシー保護型AI肌分析ビューティーブース', boothDesc:'スパやロッカーゾーン向けのAI肌関心度分析、Kビューティー商品提案、相談接続システムです。', boothNotice:'本サービスは医療診断ではなく参考用の肌分析補助です。', boothButton:'ブース型事業モデルを見る', premiumAccessConfirmed:'Premium Access確認完了', premiumPanelTitle:'釜山グッズ購入者専用AI Kビューティーコンシェルジュレポート', premiumPanelDesc:'無料分析より詳しい肌コンディション参考レポート、Kビューティールーティン、製品カテゴリー、韓国相談準備チェックリストを確認できます。', premiumAnalyzeStart:'プレミアム分析開始', qualityCheckBtn:'写真品質確認', overallScore:'総合肌コンディションスコア', scanGoodsQr:'グッズQRをスキャン', premiumReportView:'プレミアムレポートを見る', qrTitle:'グッズ案内書のQRをスキャンしてください', qrStart:'QRスキャン開始', qrCancel:'スキャン取消', qrInvalid:'無効なQRです。グッズ案内書のQRを再確認してください。' };
  translations.zh = { ...translations.en, title:'AI皮肤分析与护理礼宾', subtitle:'面向高端K-Beauty和医疗旅行护理的AI参考分析', badgeAi:'AI参考分析', badgeNoStore:'不保存照片', badgeNotMedical:'非医疗诊断', badgeKBeauty:'K-Beauty护理指南', badgeConsult:'可连接专业咨询', guide:'启动相机，将面部对准引导框，然后点击AI拍摄。', startBtn:'启动相机', captureBtn:'AI拍摄', reportTitle:'AI皮肤分析报告', reportDesc:'拍摄后分析报告将以卡片形式显示。', boothEyebrow:'线下扩展模式', boothTitle:'隐私保护型AI皮肤分析美容亭', boothDesc:'适合水疗和更衣区的AI皮肤关注度分析、K-Beauty产品推荐和咨询连接系统。', boothNotice:'本服务不是医疗诊断，而是参考用皮肤分析辅助。', boothButton:'查看美容亭商业模式', premiumAccessConfirmed:'Premium Access 已确认', premiumPanelTitle:'釜山商品购买客户专属AI K-Beauty礼宾报告', premiumPanelDesc:'可查看比免费分析更详细的皮肤状态参考报告、K-Beauty流程、产品类别和韩国咨询准备清单。', premiumAnalyzeStart:'开始高级分析', qualityCheckBtn:'照片质量确认', overallScore:'综合皮肤状态分数', scanGoodsQr:'扫描商品QR', premiumReportView:'查看高级报告', qrTitle:'请扫描商品指南QR', qrStart:'开始扫描QR', qrCancel:'取消扫描', qrInvalid:'QR无效。请重新确认商品指南中的QR。' };
  Object.assign(translations.vi, { premiumPanelDesc:'Chụp ảnh khuôn mặt để xem báo cáo tham khảo tình trạng da chi tiết hơn, routine K-beauty, danh mục sản phẩm và checklist tư vấn tại Hàn Quốc.', privacyNotice:'Ảnh chụp chỉ được dùng làm tư liệu tham khảo để tạo báo cáo tình trạng da và mặc định không lưu lâu dài.', premiumConfirmText:'Tôi xác nhận đây là báo cáo tham khảo tình trạng da, không phải chẩn đoán y tế.', qualityChecking:'Đang kiểm tra chất lượng ảnh...', qualityCenter:'Khuôn mặt ở giữa màn hình', qualityLighting:'Ánh sáng không quá tối', qualityDistance:'Khuôn mặt không quá xa', qualityBlur:'Ảnh không bị rung nhiều', qualityMask:'Không đeo khẩu trang hoặc kính râm', qualityGood:'Chất lượng ảnh: Tốt', premiumLockTitle:'Báo cáo Premium đang khóa', premiumLockDesc:'Dựa trên ảnh vừa chụp, bạn có thể xem báo cáo AI K-beauty concierge chi tiết hơn. Quét QR trong hướng dẫn quà Busan để mở báo cáo Premium.', sevenScores:'7 điểm thành phần', topConcerns:'Top 5 mối quan tâm về da', zoneObservation:'Quan sát theo vùng khuôn mặt', morningRoutine:'Routine K-beauty buổi sáng', eveningRoutine:'Routine K-beauty buổi tối', weeklyCare:'Routine chăm sóc hằng tuần', productCategories:'Danh mục sản phẩm gợi ý', consultChecklist:'Checklist chuẩn bị tư vấn K-beauty / du lịch y tế Hàn Quốc', kBeautyConsult:'Đăng ký tư vấn K-beauty', medicalTourConsult:'Đăng ký tư vấn du lịch y tế Hàn Quốc', emailReport:'Nhận báo cáo qua email', backHome:'Quay lại VR MEDI TOUR', hydration:'Ước tính độ ẩm', oilBalance:'Cân bằng dầu', texture:'Độ đều bề mặt da', pores:'Độ thấy rõ lỗ chân lông', redSensitive:'Tín hiệu đỏ/nhạy cảm', toneEvenness:'Độ đều màu da', glow:'Độ rạng rỡ', needFreeCapture:'Cần chụp phân tích da miễn phí trước khi tạo báo cáo Premium.', premiumOpened:'Báo cáo Premium dành cho khách mua quà Busan đã mở.', premiumViewHint:'Nhấn Xem báo cáo Premium để tạo báo cáo chi tiết từ kết quả miễn phí mà không cần chụp lại.' });
  Object.assign(translations.ja, { privacyNotice:'撮影画像は肌コンディションレポート作成の参考資料としてのみ使用され、初期設定では長期保存されません。', premiumConfirmText:'本サービスは医療診断ではなく肌コンディション参考レポートであることを確認しました。', qualityChecking:'写真品質を確認中...', qualityCenter:'顔が画面中央にある', qualityLighting:'照明が暗すぎない', qualityDistance:'顔が遠すぎない', qualityBlur:'ブレが大きくない', qualityMask:'マスクやサングラスがない', qualityGood:'写真品質：良好', premiumLockTitle:'プレミアムレポートロック', premiumLockDesc:'今撮影した写真を基に、より詳しいAI Kビューティーコンシェルジュレポートを確認できます。釜山グッズ案内書のQRをスキャンすると開きます。', sevenScores:'7つのサブスコア', topConcerns:'肌悩みTOP 5', zoneObservation:'顔部位別観察', morningRoutine:'朝のKビューティールーティン', eveningRoutine:'夜のKビューティールーティン', weeklyCare:'週間ケアルーティン', productCategories:'おすすめ製品カテゴリー', consultChecklist:'韓国Kビューティー・医療観光相談準備チェックリスト', kBeautyConsult:'Kビューティー相談申請', medicalTourConsult:'韓国医療観光相談申請', emailReport:'レポートをメールで受け取る', backHome:'VR MEDI TOURホームへ戻る', hydration:'水分感推定', oilBalance:'油分バランス', texture:'肌きめ均一度', pores:'毛穴の見え方', redSensitive:'赤み・敏感サイン', toneEvenness:'トーン均一度', glow:'ツヤ・生気', needFreeCapture:'プレミアムレポート作成には先に無料肌分析撮影が必要です。', premiumOpened:'釜山グッズ購入者専用プレミアムレポートが開きました。', premiumViewHint:'プレミアムレポートを見るを押すと、再撮影せず無料分析結果を基に詳細レポートを作成します。' });
  Object.assign(translations.zh, { privacyNotice:'拍摄图像仅作为生成皮肤状态报告的参考资料，默认不长期保存。', premiumConfirmText:'我确认本服务是皮肤状态参考报告，不是医疗诊断。', qualityChecking:'正在确认照片质量...', qualityCenter:'脸部位于画面中央', qualityLighting:'光线不太暗', qualityDistance:'脸部距离不太远', qualityBlur:'抖动不严重', qualityMask:'未佩戴口罩或太阳镜', qualityGood:'照片质量：良好', premiumLockTitle:'高级报告已锁定', premiumLockDesc:'基于刚拍摄的照片，您可以查看更详细的AI K-Beauty礼宾报告。扫描釜山商品指南中的QR即可打开高级报告。', sevenScores:'7项子分数', topConcerns:'皮肤关注TOP 5', zoneObservation:'面部分区观察', morningRoutine:'早间K-Beauty流程', eveningRoutine:'晚间K-Beauty流程', weeklyCare:'每周护理流程', productCategories:'推荐产品类别', consultChecklist:'韩国K-Beauty·医疗旅游咨询准备清单', kBeautyConsult:'申请K-Beauty咨询', medicalTourConsult:'申请韩国医疗旅游咨询', emailReport:'通过邮件接收报告', backHome:'返回VR MEDI TOUR首页', hydration:'水分感估计', oilBalance:'油脂平衡', texture:'肤质均匀度', pores:'毛孔可见度', redSensitive:'泛红·敏感信号', toneEvenness:'肤色均匀度', glow:'光泽·活力', needFreeCapture:'生成高级报告前需要先完成免费皮肤分析拍摄。', premiumOpened:'釜山商品购买客户专属高级报告已开启。', premiumViewHint:'点击查看高级报告，即可基于免费分析结果生成详细报告，无需重新拍照。' });
  translations.cn = translations.zh; translations.jp = translations.ja; translations.ar = translations.en;

  function t(k) { return translations[currentLanguage]?.[k] ?? translations.en?.[k] ?? translations.ko?.[k] ?? k; }
  function setStatus(k, loading = false) { statusEl.textContent = t(k); statusEl.classList.toggle('loading', loading); }
  function esc(s) { return String(s ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
  function li(arr) { return (arr || []).map((v) => `<li>${esc(v)}</li>`).join(''); }
  function pct(value, fallback = 70) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
  }

  function saveRecentFreeCapture(imageBase64, freeAnalysis) {
    try {
      sessionStorage.setItem(recentCaptureKey, JSON.stringify({
        imageBase64,
        freeAnalysis,
        language: currentLanguage,
        savedAt: Date.now(),
      }));
    } catch (_) {}
  }

  function getRecentFreeCapture() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(recentCaptureKey) || 'null');
      if (!saved?.imageBase64?.startsWith('data:image/')) return null;
      const maxAgeMs = 30 * 60 * 1000;
      if (Date.now() - Number(saved.savedAt || 0) > maxAgeMs) return null;
      return saved;
    } catch (_) {
      return null;
    }
  }

  function applyLanguage(lang) {
    currentLanguage = supported.includes(lang) ? lang : 'ko';
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = premiumUnlocked && el.dataset.premiumI18n ? el.dataset.premiumI18n : el.dataset.i18n;
      const translated = t(key);
      if (translated) el.textContent = translated;
    });
    document.querySelectorAll('#languageButtons button').forEach((b) => b.classList.toggle('active', b.dataset.lang === currentLanguage));
    captureBtn.textContent = captureBtn.disabled ? t('captureLoading') : t(premiumUnlocked ? 'premiumCaptureBtn' : 'captureBtn');
    localStorage.setItem('vrmtAiSkinLang', currentLanguage);
    configureMode();
    bindPremiumControlEvents();
    if (premiumUnlocked) preparePremiumReportAfterAuth();
    if (lastAnalysis) renderReport(lastAnalysis, lastReportMode);
    else if (lastErrorReport) renderError(lastErrorReport.message, lastErrorReport.payload);
  }

  function renderModeShell() {
    if (premiumUnlocked) {
      modePanel.innerHTML = `
        <section id="vrmtPremiumPanel" class="premium-panel premium-panel--active" aria-live="polite">
          <div class="premium-access-badge">${esc(t('premiumAccessConfirmed'))}</div>
          <h2>${esc(t('premiumPanelTitle'))}</h2>
          <p>
            ${esc(t('premiumPanelDesc'))}
          </p>
          <p class="privacy-notice">
            ${esc(t('privacyNotice'))}
          </p>
        </section>`;
      premiumControls.innerHTML = `
        <div class="premium-unlock-card" id="vrmtPremiumUnlockCard">
          <strong>${esc(t('premiumUnlockSuccess'))}</strong>
          <p>${esc(t('premiumUnlockDesc'))}</p>
        </div>
        <div class="premium-step-row" aria-label="Premium analysis steps">
          <span>${esc(t('premiumStep1'))}</span>
          <span>${esc(t('premiumStep2'))}</span>
          <span>${esc(t('premiumStep3'))}</span>
          <span>${esc(t('premiumStep4'))}</span>
        </div>
        <div id="vrmtPremiumQuality" class="quality-panel" hidden></div>
        <label class="premium-confirm">
          <input id="vrmtPremiumConfirm" type="checkbox" />
          <span>${esc(t('premiumConfirmText'))}</span>
        </label>
        <div class="actions premium-actions">
          <button id="vrmtRetakeBtn" class="btn" type="button">${esc(t('retakeBtn'))}</button>
          <button id="vrmtQualityCheckBtn" class="btn" type="button" disabled>${esc(t('qualityCheckBtn'))}</button>
          <button id="vrmtPremiumAnalyzeBtn" class="btn primary" type="button" disabled>${esc(t('premiumAnalyzeStart'))}</button>
          <button id="vrmtPremiumReportBtn" class="btn primary" type="button" disabled>${esc(t('premiumReportView'))}</button>
        </div>`;
    } else {
      modePanel.replaceChildren();
      premiumControls.replaceChildren();
    }

    premiumPanel = $('vrmtPremiumPanel');
    premiumConfirm = $('vrmtPremiumConfirm');
    premiumQuality = $('vrmtPremiumQuality');
    premiumAnalyzeBtn = $('vrmtPremiumAnalyzeBtn');
    retakeBtn = $('vrmtRetakeBtn');
    qualityCheckBtn = $('vrmtQualityCheckBtn');
    premiumReportBtn = $('vrmtPremiumReportBtn');
  }

  function bindPremiumControlEvents() {
    premiumConfirm?.addEventListener('change', updatePremiumAnalyzeState);
    premiumAnalyzeBtn?.addEventListener('click', runPremiumAnalysis);
    premiumReportBtn?.addEventListener('click', runPremiumAnalysis);
    retakeBtn?.addEventListener('click', resetPremiumCapture);
    qualityCheckBtn?.addEventListener('click', () => { if (pendingPremiumImage) showQualityCheck(); });
  }

  function configureMode() {
    renderModeShell();
    document.body.classList.toggle('premium-mode', premiumUnlocked);
    document.body.classList.toggle('free-mode', !premiumUnlocked);
    captureBtn.textContent = t(premiumUnlocked ? 'premiumCaptureBtn' : 'captureBtn');
    if (premiumUnlocked) {
      statusEl.textContent = t('premiumStatusInit');
    }
  }

  function mapMessage(raw = '') {
    const msg = String(raw || '').trim();
    if (!msg) return t('errAnalyze');
    if (msg.includes('OPENAI_API_KEY')) return t('errApiKey');
    if (/quota|rate limit|insufficient/i.test(msg)) return t('errQuota');
    if (/data:image|imageBase64|invalid image|형식/i.test(msg)) return t('errImageFormat');
    if (/too large|too big|용량|6000000|413/i.test(msg)) return t('errImageSize');
    return msg;
  }

  function setLoading(v) {
    captureBtn.disabled = v;
    if (premiumAnalyzeBtn && premiumConfirm) premiumAnalyzeBtn.disabled = v || !qualityReady || !premiumConfirm.checked;
    captureBtn.textContent = v ? t('captureLoading') : t(premiumUnlocked ? 'premiumCaptureBtn' : 'captureBtn');
    if (premiumAnalyzeBtn) premiumAnalyzeBtn.textContent = v ? t('premiumGenerating') : t('premiumAnalyzeStart');
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('errNoCamera'); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      video.srcObject = stream;
      setStatus('statusCameraOn');
      setTimeout(() => guide?.classList.add('vrmt-aligned'), 2000);
    } catch (_) {
      setStatus('errCameraPermission');
    }
  }

  function captureResized() {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const tw = Math.min(w, 1024);
    const th = Math.round((h / w) * tw);
    canvas.width = tw;
    canvas.height = th;
    canvas.getContext('2d').drawImage(video, 0, 0, tw, th);
    return canvas.toDataURL('image/jpeg', 0.82);
  }

  async function capture() {
    if (!stream) { setStatus('statusNeedCamera'); return; }
    const imageBase64 = captureResized();
    if (premiumUnlocked && getRecentFreeCapture()) {
      pendingPremiumImage = imageBase64;
      if (qualityCheckBtn) qualityCheckBtn.disabled = false;
      showQualityCheck();
      return;
    }
    setLoading(true);
    try {
      await analyze(imageBase64, null, { forceFree: premiumUnlocked && !getRecentFreeCapture() });
      if (premiumUnlocked) preparePremiumReportAfterAuth();
    } finally { setLoading(false); }
  }

  function showQualityCheck() {
    qualityReady = false;
    if (!premiumQuality || !premiumAnalyzeBtn) return;
    if (qualityCheckBtn) qualityCheckBtn.textContent = t('qualityChecking');
    premiumQuality.hidden = false;
    premiumAnalyzeBtn.disabled = true;
    premiumQuality.innerHTML = `
      <h3>${esc(t('qualityChecking'))}</h3>
      <ul class="quality-list">
        <li>${esc(t('qualityCenter'))}</li>
        <li>${esc(t('qualityLighting'))}</li>
        <li>${esc(t('qualityDistance'))}</li>
        <li>${esc(t('qualityBlur'))}</li>
        <li>${esc(t('qualityMask'))}</li>
      </ul>
      <div class="quality-result pending">${esc(t('qualityWaiting'))}</div>
      <div class="quality-actions">
        <button id="vrmtRetakeBtnInline" class="btn" type="button">${esc(t('retakeLong'))}</button>
        <button id="vrmtPremiumAnalyzeBtnInline" class="btn primary" type="button" disabled>${esc(t('premiumAnalyzeStart'))}</button>
      </div>`;
    setStatus('statusQualityReady');
    setTimeout(() => {
      qualityReady = true;
      premiumQuality.querySelector('.quality-result').className = 'quality-result good';
      premiumQuality.querySelector('.quality-result').innerHTML = `<strong>${esc(t('qualityGood'))}</strong><br>${esc(t('premiumCanGenerate'))}<br><span>${esc(t('retakeForBetter'))}</span>`;
      wireQualityButtons();
      if (qualityCheckBtn) qualityCheckBtn.textContent = t('qualityCheckBtn');
      updatePremiumAnalyzeState();
    }, 650);
    wireQualityButtons();
  }

  function wireQualityButtons() {
    premiumQuality.querySelector('#vrmtRetakeBtnInline')?.addEventListener('click', resetPremiumCapture);
    premiumQuality.querySelector('#vrmtPremiumAnalyzeBtnInline')?.addEventListener('click', runPremiumAnalysis);
  }

  function resetPremiumCapture() {
    pendingPremiumImage = null;
    pendingPremiumFreeAnalysis = null;
    qualityReady = false;
    if (premiumConfirm) premiumConfirm.checked = false;
    if (premiumQuality) premiumQuality.hidden = true;
    if (qualityCheckBtn) { qualityCheckBtn.disabled = true; qualityCheckBtn.textContent = t('qualityCheckBtn'); }
    setStatus('statusCameraOn');
    updatePremiumAnalyzeState();
  }

  function updatePremiumAnalyzeState() {
    const enabled = Boolean(premiumUnlocked && pendingPremiumImage && qualityReady && premiumConfirm?.checked);
    if (premiumAnalyzeBtn) premiumAnalyzeBtn.disabled = !enabled;
    if (premiumReportBtn) premiumReportBtn.disabled = !enabled;
    premiumQuality?.querySelector('#vrmtPremiumAnalyzeBtnInline')?.toggleAttribute('disabled', !enabled);
  }

  async function runPremiumAnalysis() {
    if (!pendingPremiumImage || !qualityReady || !premiumConfirm?.checked) return;
    setLoading(true);
    try { await analyze(pendingPremiumImage, pendingPremiumFreeAnalysis); } finally { setLoading(false); }
  }

  async function analyze(imageBase64, sourceFreeAnalysis = null, options = {}) {
    setStatus('statusAnalyzing', true);
    const requestPremium = premiumUnlocked && !options.forceFree;
    const body = requestPremium
      ? { imageBase64, image: imageBase64, mode: 'premium', premium: premiumAccessCode, language: currentLanguage, freeAnalysis: sourceFreeAnalysis }
      : { imageBase64, image: imageBase64, mode: 'free', language: currentLanguage };
    try {
      const res = await fetch('/.netlify/functions/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        const m = mapMessage(json.error || json.message);
        statusEl.textContent = m;
        lastAnalysis = null;
        lastErrorReport = { message: m, payload: json };
        renderError(m, json);
        return;
      }
      lastAnalysis = json.analysis || {};
      lastReportMode = requestPremium ? 'premium' : 'free';
      if (!requestPremium) saveRecentFreeCapture(imageBase64, lastAnalysis);
      lastErrorReport = null;
      renderReport(lastAnalysis, lastReportMode);
      setStatus('statusDone');
    } catch (_) {
      const m = t('errServer');
      statusEl.textContent = m;
      lastAnalysis = null;
      lastErrorReport = { message: m, payload: { ok: false } };
      renderError(m, { ok: false });
    } finally {
      statusEl.classList.remove('loading');
    }
  }

  function renderError(message, payload) {
    analysis.innerHTML = `<h2>${esc(t('reportTitle'))}</h2><div class="report-item"><strong>${esc(message)}</strong></div><details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(payload, null, 2))}</pre></details>${noticeMarkup()}`;
  }

  function renderReport(a, mode = null) {
    if ((mode || lastReportMode) === 'premium') renderPremiumReport(a);
    else renderFreeReport(a);
  }

  function renderFreeReport(a) {
    analysis.innerHTML = `
      <h2>${esc(t('reportTitle'))}</h2>
      <div class="report-grid">
        <div class="report-item"><strong>${esc(t('skinSummary'))}</strong><p>${esc(a.summary || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('imageQuality'))}</strong><p>${esc(String(a.confidence ?? '-'))}</p></div>
        <div class="report-item"><strong>${esc(t('tone'))}</strong><p>${esc((a.observations || [])[0] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('redness'))}</strong><p>${esc((a.observations || [])[1] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('moisture'))}</strong><p>${esc((a.observations || [])[2] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('consult'))}</strong><p>${esc(a.dermatology_consult_recommendation || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('carePriority'))}</strong><ul>${li(a.care_priority)}</ul></div>
        <div class="report-item"><strong>${esc(t('productDirection'))}</strong><ul>${li(a.recommended_product_direction)}</ul></div>
      </div>
      <div class="premium-info-card">
        <strong>${esc(t('premiumLockTitle'))}</strong>
        <p>${esc(t('premiumLockDesc'))}</p>
        <button id="vrmtOpenQrScanBtn" class="btn primary" type="button">${esc(t('scanGoodsQr'))}</button>
      </div>
      <details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(a, null, 2))}</pre></details>
      ${noticeMarkup()}`;
    document.getElementById('vrmtOpenQrScanBtn')?.addEventListener('click', openQrScannerModal);
  }

  function renderPremiumReport(a) {
    const premium = normalizePremiumAnalysis(a);
    analysis.innerHTML = `
      <div class="premium-report-head">
        <span class="premium-chip">BUSANBLUE Premium</span>
        <h2>${esc(t('premiumReportTitle'))}</h2>
        <p>${esc(t('premiumReportIntro'))}</p>
      </div>
      <section class="score-card">
        <div><span>${esc(t('overallScore'))}</span><strong>${premium.overallScore}</strong><em>/ 100</em></div>
        <p>${esc(premium.summary)}</p>
      </section>
      <section class="premium-section"><h3>${esc(t('sevenScores'))}</h3><div class="score-grid">${scoreBars(premium.subScores)}</div></section>
      <section class="premium-section"><h3>${esc(t('topConcerns'))}</h3><ol>${li(premium.topConcerns)}</ol></section>
      <section class="premium-section"><h3>${esc(t('zoneObservation'))}</h3><div class="zone-grid">${zoneItems(premium.zoneAnalysis)}</div></section>
      <section class="premium-section routine-grid">
        <div><h3>${esc(t('morningRoutine'))}</h3><ul>${li(premium.morningRoutine)}</ul></div>
        <div><h3>${esc(t('eveningRoutine'))}</h3><ul>${li(premium.eveningRoutine)}</ul></div>
        <div><h3>${esc(t('weeklyCare'))}</h3><ul>${li(premium.weeklyCare)}</ul></div>
        <div><h3>${esc(t('productCategories'))}</h3><ul>${li(premium.productCategories)}</ul></div>
      </section>
      <section class="premium-section"><h3>${esc(t('consultChecklist'))}</h3><ul>${li(premium.koreaConsultChecklist)}</ul></section>
      <div class="premium-cta-row">
        <a class="btn primary" href="/#consultation?source=BUSANBLUE">${esc(t('kBeautyConsult'))}</a>
        <a class="btn primary" href="/#consultation?source=BUSANBLUE-medical">${esc(t('medicalTourConsult'))}</a>
        <a class="btn" href="/#consultation?source=BUSANBLUE-report">${esc(t('emailReport'))}</a>
        <a class="btn" href="/">${esc(t('backHome'))}</a>
      </div>
      <details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(a, null, 2))}</pre></details>
      ${noticeMarkup(true)}`;
  }

  function noticeMarkup(includePrivacy = false) {
    return `${includePrivacy ? `<p class="privacy-notice">${esc(privacyNotice)}</p>` : ''}<p class="safety">${esc(medicalSafetyNotice)}</p><p class="safety">${esc(t('languageNotice'))}</p>`;
  }

  function normalizePremiumAnalysis(a) {
    return {
      overallScore: pct(a.overallScore, Math.round((Number(a.confidence) || 0.72) * 100)),
      summary: a.summary || '촬영 이미지에서 확인 가능한 피부 컨디션을 기준으로 K-뷰티 루틴과 상담 전 준비 항목을 정리했습니다.',
      subScores: {
        hydration: pct(a.subScores?.hydration, 68), oilBalance: pct(a.subScores?.oilBalance, 72), texture: pct(a.subScores?.texture, 66), pores: pct(a.subScores?.pores, 61), redness: pct(a.subScores?.redness, 70), toneEvenness: pct(a.subScores?.toneEvenness, 69), glow: pct(a.subScores?.glow, 67),
      },
      topConcerns: a.topConcerns?.length ? a.topConcerns : ['수분 관리 루틴 점검', '유분 밸런스 관리', '피부결 균일도 관리', '모공 가시성 관리', '톤 균일도 관리'],
      zoneAnalysis: {
        forehead: a.zoneAnalysis?.forehead || '이마: 번들거림과 건조감을 함께 확인하며 가벼운 수분 레이어링을 권장합니다.',
        cheeks: a.zoneAnalysis?.cheeks || '양 볼: 수분감과 붉은기 신호를 중심으로 순한 보습 케어를 준비하세요.',
        nose: a.zoneAnalysis?.nose || '코 주변: 유분 밸런스와 모공 가시성이 두드러질 수 있어 세안 강도를 조절하세요.',
        mouthArea: a.zoneAnalysis?.mouthArea || '입가: 건조감이 쉽게 느껴질 수 있어 장벽 보습 제품 카테고리를 참고하세요.',
        chin: a.zoneAnalysis?.chin || '턱: 마찰과 유분 변화를 고려해 자극이 적은 루틴으로 관리하세요.',
        eyeArea: a.zoneAnalysis?.eyeArea || '눈가: 얇은 피부 부위이므로 가벼운 보습과 자외선 차단 루틴을 유지하세요.',
      },
      morningRoutine: a.morningRoutine?.length ? a.morningRoutine : ['저자극 클렌징 또는 미온수 세안', '수분 토너와 가벼운 세럼', '유분 밸런스를 고려한 보습제', '자외선 차단제 충분히 바르기'],
      eveningRoutine: a.eveningRoutine?.length ? a.eveningRoutine : ['메이크업·자외선 차단제 잔여물 클렌징', '수분 세럼 또는 진정 앰플 카테고리 확인', '보습 크림으로 마무리', '새 제품은 작은 부위에 먼저 확인'],
      weeklyCare: a.weeklyCare?.length ? a.weeklyCare : ['주 1~2회 수분 마스크 또는 진정 마스크', '과도한 스크럽 대신 부드러운 피부결 관리', '촬영 전후 피부 변화 메모', '상담 전 현재 루틴과 제품 목록 정리'],
      productCategories: a.productCategories?.length ? a.productCategories : ['수분 토너', '진정 세럼', '장벽 보습 크림', '저자극 클렌저', '데일리 자외선 차단제'],
      koreaConsultChecklist: a.koreaConsultChecklist?.length ? a.koreaConsultChecklist : ['현재 사용하는 제품과 성분 사진 준비', '피부 컨디션 변화 시기 메모', '원하는 K-뷰티 루틴 목표 정리', '상담 가능한 일정과 언어 요청 정리', '사진·리포트 공유는 별도 동의 후 진행'],
    };
  }

  function scoreBars(scores) {
    const labels = { hydration: t('hydration'), oilBalance: t('oilBalance'), texture: t('texture'), pores: t('pores'), redness: t('redSensitive'), toneEvenness: t('toneEvenness'), glow: t('glow') };
    return Object.entries(labels).map(([key, label]) => `<div class="score-row"><span>${label}</span><strong>${scores[key]}</strong><i style="--score:${scores[key]}%"></i></div>`).join('');
  }

  function zoneItems(zones) {
    const labels = { forehead: t('forehead'), cheeks: t('cheeks'), nose: t('nose'), mouthArea: t('mouthArea'), chin: t('chin'), eyeArea: t('eyeArea') };
    return Object.entries(labels).map(([key, label]) => `<div class="report-item"><strong>${label}</strong><p>${esc(zones[key])}</p></div>`).join('');
  }

  function preparePremiumReportAfterAuth() {
    const recent = getRecentFreeCapture();
    if (!recent) {
      if (premiumQuality) {
        premiumQuality.hidden = false;
        premiumQuality.innerHTML = `<h3>${esc(t('needFreeCapture'))}</h3><p>${esc(t('needFreeCaptureGuide'))}</p>`;
      }
      return;
    }
    pendingPremiumImage = recent.imageBase64;
    pendingPremiumFreeAnalysis = recent.analysis || null;
    qualityReady = true;
    if (premiumConfirm) premiumConfirm.checked = true;
    if (premiumQuality) {
      premiumQuality.hidden = false;
      premiumQuality.innerHTML = `<h3>${esc(t('premiumAccessConfirmed'))}</h3><div class="quality-result good"><strong>${esc(t('premiumOpened'))}</strong><br>${esc(t('premiumViewHint'))}</div>`;
    }
    updatePremiumAnalyzeState();
  }

  function unlockPremiumAccess() {
    premiumUnlocked = true;
    renderModeShell();
    document.body.classList.add('premium-mode');
    document.body.classList.remove('free-mode');
    statusEl.textContent = t('premiumAccessConfirmed');
    preparePremiumReportAfterAuth();
    bindPremiumControlEvents();
  }

  function isValidPremiumQr(value) {
    const raw = String(value || '').trim();
    if (!raw) return false;
    if (raw.toUpperCase() === premiumAccessCode) return true;
    try {
      const url = new URL(raw, window.location.origin);
      const source = url.searchParams.get('source') || url.searchParams.get('utm_source') || '';
      return url.searchParams.get('premium') === premiumAccessCode && /goods|busanblue|qr/i.test(source);
    } catch (_) {
      return /BUSANBLUE-GOODS-QR/i.test(raw);
    }
  }

  function stopQrScanner() {
    if (qrScanTimer) cancelAnimationFrame(qrScanTimer);
    qrScanTimer = null;
    qrScanStream?.getTracks().forEach((track) => track.stop());
    qrScanStream = null;
  }

  function showQrResult(message, ok = false) {
    const result = document.getElementById('vrmtQrScanResult');
    if (!result) return;
    result.className = ok ? 'qr-scan-result success' : 'qr-scan-result error';
    result.textContent = message;
  }

  async function startQrScanner() {
    const videoEl = document.getElementById('vrmtQrScannerVideo');
    if (!videoEl) return;
    if (!('BarcodeDetector' in window)) {
      showQrResult(t('qrUnsupported'));
      return;
    }
    try {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      qrScanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      videoEl.srcObject = qrScanStream;
      await videoEl.play();
      const scan = async () => {
        try {
          const codes = await detector.detect(videoEl);
          const raw = codes?.[0]?.rawValue || '';
          if (raw) {
            if (isValidPremiumQr(raw)) {
              showQrResult(t('premiumAccessConfirmed'), true);
              stopQrScanner();
              document.getElementById('vrmtQrPremiumViewBtn')?.removeAttribute('disabled');
              return;
            }
            showQrResult(t('qrInvalid'));
          }
        } catch (_) {}
        qrScanTimer = requestAnimationFrame(scan);
      };
      scan();
    } catch (_) {
      showQrResult(t('qrCameraError'));
    }
  }

  function openQrScannerModal() {
    if (!getRecentFreeCapture()) {
      analysis.insertAdjacentHTML('beforeend', `<p class="safety">${esc(t('needFreeCapture'))}</p>`);
      return;
    }
    const existing = document.getElementById('vrmtQrScanModal');
    existing?.remove();
    const modal = document.createElement('div');
    modal.id = 'vrmtQrScanModal';
    modal.className = 'qr-scan-modal';
    modal.innerHTML = `
      <div class="qr-scan-dialog" role="dialog" aria-modal="true" aria-labelledby="vrmtQrScanTitle">
        <h2 id="vrmtQrScanTitle">${esc(t('qrTitle'))}</h2>
        <p>${esc(t('qrDesc'))}</p>
        <video id="vrmtQrScannerVideo" class="qr-scan-video" playsinline muted></video>
        <p id="vrmtQrScanResult" class="qr-scan-result">${esc(t('qrReady'))}</p>
        <div class="actions qr-scan-actions">
          <button id="vrmtStartQrScanBtn" class="btn primary" type="button">${esc(t('qrStart'))}</button>
          <button id="vrmtCancelQrScanBtn" class="btn" type="button">${esc(t('qrCancel'))}</button>
          <button id="vrmtQrPremiumViewBtn" class="btn primary" type="button" disabled>${esc(t('premiumReportView'))}</button>
        </div>
        <details class="qr-manual-code"><summary>${esc(t('qrManualSummary'))}</summary><input id="vrmtQrManualCode" type="text" autocomplete="off" placeholder="${esc(t('qrManualPlaceholder'))}" /><button id="vrmtQrManualSubmitBtn" class="btn" type="button">${esc(t('confirmBtn'))}</button></details>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#vrmtStartQrScanBtn')?.addEventListener('click', startQrScanner);
    modal.querySelector('#vrmtCancelQrScanBtn')?.addEventListener('click', () => { stopQrScanner(); modal.remove(); });
    modal.querySelector('#vrmtQrPremiumViewBtn')?.addEventListener('click', () => { stopQrScanner(); modal.remove(); unlockPremiumAccess(); });
    modal.querySelector('#vrmtQrManualSubmitBtn')?.addEventListener('click', () => {
      const value = modal.querySelector('#vrmtQrManualCode')?.value || '';
      if (isValidPremiumQr(value)) {
        showQrResult(t('premiumAccessConfirmed'), true);
        modal.querySelector('#vrmtQrPremiumViewBtn')?.removeAttribute('disabled');
      } else {
        showQrResult(t('qrInvalid'));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    configureMode();
    document.querySelectorAll('#languageButtons button').forEach((btn) => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
    applyLanguage(localStorage.getItem('vrmtAiSkinLang') || 'ko');
    startBtn?.addEventListener('click', startCamera);
    captureBtn?.addEventListener('click', capture);
    bindPremiumControlEvents();
  });
}());
