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
  const premiumAccessStorageKey = 'aiSkinPremiumAccess';
  let premiumUnlocked = (() => {
    try { return sessionStorage.getItem(premiumAccessStorageKey) === premiumAccessCode; }
    catch (_) { return false; }
  })();
  const supported = ['ko', 'en', 'vi', 'ja', 'jp', 'zh', 'cn', 'ar'];
  const medicalSafetyNotice = '본 리포트는 의료 진단이 아닌 카메라 이미지 기반의 비의료적 피부 컨디션 참고 자료입니다. 질병명 확인이나 약 처방을 제공하지 않으며, 불편감이 있거나 전문 확인이 필요하면 의료기관 상담을 이용해 주세요.';
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
  Object.assign(translations.ko, { boothEyebrow:'오프라인 확장 모델', boothTitle:'프라이버시 보호형 AI 피부분석 뷰티 부스', boothDesc:'찜질방, 스파, 골프장 락커존에 적합한 AI 피부 관심도 분석 · K-뷰티 제품 추천 · 자동판매 · 상담 연결 시스템입니다.', boothNotice:'본 서비스는 의료 진단이 아닌 참고용 피부 관심도 분석 및 K-뷰티 상담 보조 서비스입니다.', boothButton:'부스형 사업 모델 보기', boothCaption:'AI 콘셉트 이미지 · 실제 설치 전 사용 시나리오 설명용', premiumAccessConfirmed:'Premium Access 확인 완료', premiumPanelTitle:'부산 굿즈 구매 고객 전용 AI K-뷰티 컨시어지 리포트', premiumPanelDesc:'카메라로 얼굴 사진을 촬영하면 무료 분석보다 자세한 피부 컨디션 참고 리포트, K-뷰티 루틴, 제품 카테고리, 한국 상담 준비 체크리스트를 확인할 수 있습니다.', privacyNotice:'촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다. 기본 설정에서는 장기 저장하지 않으며, 상담 또는 이메일 리포트 수신을 신청하는 경우 별도 동의가 필요합니다.', premiumUnlockSuccess:'BUSANBLUE 프리미엄 인증 성공', premiumUnlockDesc:'방금 촬영한 사진과 무료 분석 결과가 이 브라우저 세션에 있으면 새로 사진을 찍지 않고 프리미엄 리포트를 생성합니다.', premiumStep1:'1. 무료 분석 완료', premiumStep2:'2. 굿즈 QR 인증', premiumStep3:'3. 기존 사진 확인', premiumStep4:'4. 프리미엄 리포트 생성', premiumConfirmText:'본 서비스가 의료 진단이 아닌 피부 컨디션 참고 리포트임을 확인했습니다.', retakeBtn:'다시 촬영', qualityCheckBtn:'사진 품질 확인', premiumAnalyzeStart:'프리미엄 분석 시작', premiumReportView:'프리미엄 리포트 보기', qualityChecking:'사진 품질 확인 중...', qualityCenter:'얼굴이 화면 중앙에 있는지', qualityLighting:'조명이 너무 어둡지 않은지', qualityDistance:'얼굴이 너무 멀지 않은지', qualityBlur:'흔들림이 심하지 않은지', qualityMask:'마스크나 선글라스가 없는지', qualityWaiting:'확인 중입니다. 잠시만 기다려 주세요.', retakeLong:'다시 촬영하기', qualityGood:'사진 품질: 양호', premiumCanGenerate:'프리미엄 리포트를 생성할 수 있습니다.', retakeForBetter:'더 안정적인 리포트를 위해 다시 촬영해주세요.', premiumGenerating:'프리미엄 리포트 생성 중...', premiumLockTitle:'프리미엄 리포트 잠금', premiumLockDesc:'방금 촬영한 사진을 기반으로 더 자세한 AI K-뷰티 컨시어지 리포트를 확인할 수 있습니다. 부산 굿즈 안내서의 QR을 스캔하면 프리미엄 리포트가 열립니다.', scanGoodsQr:'굿즈 QR 스캔하기', premiumReportIntro:'무료 분석보다 자세한 피부 컨디션 참고 리포트, K-뷰티 루틴, 제품 카테고리, 한국 상담 준비 체크리스트입니다.', overallScore:'종합 피부 컨디션 점수', sevenScores:'7개 하위 점수', topConcerns:'피부 고민 TOP 5', zoneObservation:'얼굴 부위별 관찰', morningRoutine:'아침 K-뷰티 루틴', eveningRoutine:'저녁 K-뷰티 루틴', weeklyCare:'주간 케어 루틴', productCategories:'추천 제품 카테고리', consultChecklist:'한국 K-뷰티·의료관광 상담 준비 체크리스트', kBeautyConsult:'K-뷰티 상담 신청', medicalTourConsult:'한국 의료관광 상담 신청', emailReport:'리포트 이메일로 받기', backHome:'VR MEDI TOUR 홈으로 돌아가기', hydration:'수분감 추정', oilBalance:'유분 밸런스', texture:'피부결 균일도', pores:'모공 가시성', redSensitive:'붉은기·민감 신호', toneEvenness:'톤 균일도', glow:'광채·생기', forehead:'이마', cheeks:'양 볼', nose:'코 주변', mouthArea:'입가', chin:'턱', eyeArea:'눈가', needFreeCapture:'프리미엄 리포트를 생성하려면 먼저 무료 피부 분석 촬영이 필요합니다.', needFreeCaptureGuide:'무료 분석을 완료한 뒤 굿즈 안내서 QR을 다시 스캔해 주세요.', premiumOpened:'부산 굿즈 구매 고객 전용 프리미엄 리포트가 열렸습니다.', premiumViewHint:'인증이 완료되면 새로 사진을 찍지 않고 무료 분석 결과를 기반으로 상세 리포트를 자동 생성합니다.', qrTitle:'굿즈 안내서 QR을 스캔해 주세요', qrDesc:'여권케이스 또는 굿즈 안내서에 인쇄된 QR을 카메라에 비추면 프리미엄 AI K-뷰티 컨시어지 리포트가 열립니다.', qrReady:'QR 스캔 시작 버튼을 눌러 주세요.', qrStart:'QR 스캔 시작', qrCancel:'스캔 취소', qrManualSummary:'QR이 인식되지 않나요? Access Code 직접 입력', qrManualPlaceholder:'Access Code', confirmBtn:'확인', qrInvalid:'유효하지 않은 QR입니다. 굿즈 안내서의 QR을 다시 확인해 주세요.', qrUnsupported:'이 브라우저에서는 자동 QR 인식이 제한됩니다. 하단의 Access Code 직접 입력을 이용해 주세요.', qrCameraError:'QR 스캔 카메라를 시작할 수 없습니다. 카메라 권한을 확인하거나 Access Code 직접 입력을 이용해 주세요.' });

  Object.assign(translations.ko, {
    photoQualityTitle:'사진 품질 평가', lighting:'조명', facePosition:'얼굴 위치', clarity:'선명도', note:'참고 메모',
    interpretation:'해석', careDirection:'관리 방향', whyItMatters:'왜 중요한가', firstAction:'첫 실행 방향',
    medicalTourismPreparation:'의료관광 상담 전 준비사항', nextBestActions:'다음 추천 행동', consultationCtaTitle:'상담 신청 CTA',
    premiumError:'프리미엄 분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    premiumAutoStarting:'BUSANBLUE 인증 성공: 같은 사진으로 프리미엄 분석을 자동으로 시작합니다.',
    premiumCtaDesc:'프리미엄 리포트를 바탕으로 K-뷰티 루틴 상담 또는 한국 방문 상담 준비를 요청할 수 있습니다.',
  });
  translations.en = { ...translations.en, boothEyebrow:'Offline Expansion Model', boothTitle:'Privacy-protective AI skin analysis beauty booth', boothDesc:'A system for spas, locker zones, product suggestions, vending, and consultation connection.', boothNotice:'This service is not a medical diagnosis; it is reference analysis and K-beauty consultation support.', boothButton:'View booth business model', boothCaption:'AI concept image · scenario explanation', premiumAccessConfirmed:'Premium Access confirmed', premiumPanelTitle:'AI K-Beauty Concierge Report for Busan goods customers', premiumPanelDesc:'View a more detailed skin condition reference report, K-beauty routine, product categories, and Korea consultation checklist.', privacyNotice:'Captured images are used only as reference material for the skin condition report and are not stored long term by default.', premiumUnlockSuccess:'BUSANBLUE premium authentication successful', premiumUnlockDesc:'If the photo and free analysis are available, the premium report is generated without a new photo.', premiumStep1:'1. Free analysis done', premiumStep2:'2. Goods QR verified', premiumStep3:'3. Existing photo checked', premiumStep4:'4. Premium report', premiumConfirmText:'I confirm this is a skin condition reference report, not a medical diagnosis.', retakeBtn:'Retake', qualityCheckBtn:'Photo quality check', premiumAnalyzeStart:'Start premium analysis', premiumReportView:'View premium report', qualityChecking:'Checking photo quality...', qualityCenter:'Face is centered', qualityLighting:'Lighting is not too dark', qualityDistance:'Face is not too far', qualityBlur:'Motion blur is not severe', qualityMask:'No mask or sunglasses', qualityWaiting:'Checking. Please wait.', retakeLong:'Retake photo', qualityGood:'Photo quality: Good', premiumCanGenerate:'The premium report can be generated.', retakeForBetter:'Retake for a more stable report if needed.', premiumGenerating:'Generating premium report...', premiumLockTitle:'Premium report locked', premiumLockDesc:'Based on the photo you just captured, you can view a more detailed AI K-beauty concierge report. Scan the QR in the Busan goods guide to open it.', scanGoodsQr:'Scan goods QR', premiumReportIntro:'A more detailed skin condition reference report, K-beauty routine, product categories, and Korea consultation checklist.', overallScore:'Overall skin condition score', sevenScores:'7 sub-scores', topConcerns:'Top 5 skin concerns', zoneObservation:'Face-zone observations', morningRoutine:'Morning K-beauty routine', eveningRoutine:'Evening K-beauty routine', weeklyCare:'Weekly care routine', productCategories:'Recommended product categories', consultChecklist:'K-beauty / medical tourism consultation checklist', kBeautyConsult:'Request K-beauty consultation', medicalTourConsult:'Request Korea medical tourism consultation', emailReport:'Receive report by email', backHome:'Back to VR MEDI TOUR home', hydration:'Estimated hydration', oilBalance:'Oil balance', texture:'Texture evenness', pores:'Pore visibility', redSensitive:'Redness/sensitivity signals', toneEvenness:'Tone evenness', glow:'Glow/vitality', forehead:'Forehead', cheeks:'Cheeks', nose:'Nose area', mouthArea:'Mouth area', chin:'Chin', eyeArea:'Eye area', needFreeCapture:'A free skin-analysis capture is required before generating the premium report.', needFreeCaptureGuide:'Complete the free analysis first, then scan the goods-guide QR again.', premiumOpened:'The premium report for Busan goods customers is open.', premiumViewHint:'Tap View premium report to generate a detailed report without taking a new photo.', qrTitle:'Scan the goods-guide QR', qrDesc:'Point the camera at the QR printed on the passport case or goods guide to open the premium report.', qrReady:'Tap Start QR scan.', qrStart:'Start QR scan', qrCancel:'Cancel scan', qrManualSummary:'QR not recognized? Enter Access Code', qrManualPlaceholder:'Access Code', confirmBtn:'Confirm', qrInvalid:'Invalid QR. Please check the QR in the goods guide again.', qrUnsupported:'Automatic QR recognition is limited in this browser. Please use Access Code entry below.', qrCameraError:'Could not start the QR camera. Check camera permission or use Access Code entry.' };
  translations.vi = { ...translations.en, title:'Phân tích da AI & Concierge chăm sóc', subtitle:'Phân tích tham khảo AI cho K-beauty cao cấp và chăm sóc du lịch y tế', badgeAi:'Phân tích tham khảo AI', badgeNoStore:'Không lưu ảnh', badgeNotMedical:'Không phải chẩn đoán y tế', badgeKBeauty:'Hướng dẫn chăm sóc K-beauty', badgeConsult:'Có thể kết nối tư vấn', guide:'Bật camera, căn mặt theo khung rồi nhấn Chụp AI.', startBtn:'Bật camera', captureBtn:'Chụp AI', reportTitle:'Báo cáo phân tích da AI', reportDesc:'Báo cáo sẽ hiển thị dạng thẻ sau khi chụp.', boothEyebrow:'Mô hình mở rộng offline', boothTitle:'Booth phân tích da AI bảo vệ riêng tư', boothButton:'Xem mô hình booth', premiumAccessConfirmed:'Xác nhận Premium Access', premiumPanelTitle:'Báo cáo AI K-Beauty Concierge dành cho khách mua quà Busan', premiumAnalyzeStart:'Bắt đầu phân tích Premium', qualityCheckBtn:'Kiểm tra chất lượng ảnh', overallScore:'Điểm tổng thể tình trạng da', scanGoodsQr:'Quét QR quà tặng', premiumReportView:'Xem báo cáo Premium', qrTitle:'Vui lòng quét QR trong hướng dẫn quà tặng', qrStart:'Bắt đầu quét QR', qrCancel:'Hủy quét', qrInvalid:'QR không hợp lệ. Vui lòng kiểm tra lại QR trong hướng dẫn quà tặng.' };
  translations.ja = { ...translations.en, title:'AI肌分析＆ケアコンシェルジュ', subtitle:'プレミアムKビューティー・医療旅行ケアのためのAI参考分析', badgeAi:'AI参考分析', badgeNoStore:'写真保存なし', badgeNotMedical:'医療診断ではありません', badgeKBeauty:'Kビューティーケア案内', badgeConsult:'専門相談連携可能', guide:'カメラを開始し、顔をガイドに合わせてAI撮影を押してください。', startBtn:'カメラ開始', captureBtn:'AI判定撮影', reportTitle:'AI肌分析レポート', reportDesc:'撮影後、分析レポートがカード形式で表示されます。', boothEyebrow:'オフライン拡張モデル', boothTitle:'プライバシー保護型AI肌分析ビューティーブース', boothDesc:'スパやロッカーゾーン向けのAI肌関心度分析、Kビューティー商品提案、相談接続システムです。', boothNotice:'本サービスは医療診断ではなく参考用の肌分析補助です。', boothButton:'ブース型事業モデルを見る', premiumAccessConfirmed:'Premium Access確認完了', premiumPanelTitle:'釜山グッズ購入者専用AI Kビューティーコンシェルジュレポート', premiumPanelDesc:'無料分析より詳しい肌コンディション参考レポート、Kビューティールーティン、製品カテゴリー、韓国相談準備チェックリストを確認できます。', premiumAnalyzeStart:'プレミアム分析開始', qualityCheckBtn:'写真品質確認', overallScore:'総合肌コンディションスコア', scanGoodsQr:'グッズQRをスキャン', premiumReportView:'プレミアムレポートを見る', qrTitle:'グッズ案内書のQRをスキャンしてください', qrStart:'QRスキャン開始', qrCancel:'スキャン取消', qrInvalid:'無効なQRです。グッズ案内書のQRを再確認してください。' };
  translations.zh = { ...translations.en, title:'AI皮肤分析与护理礼宾', subtitle:'面向高端K-Beauty和医疗旅行护理的AI参考分析', badgeAi:'AI参考分析', badgeNoStore:'不保存照片', badgeNotMedical:'非医疗诊断', badgeKBeauty:'K-Beauty护理指南', badgeConsult:'可连接专业咨询', guide:'启动相机，将面部对准引导框，然后点击AI拍摄。', startBtn:'启动相机', captureBtn:'AI拍摄', reportTitle:'AI皮肤分析报告', reportDesc:'拍摄后分析报告将以卡片形式显示。', boothEyebrow:'线下扩展模式', boothTitle:'隐私保护型AI皮肤分析美容亭', boothDesc:'适合水疗和更衣区的AI皮肤关注度分析、K-Beauty产品推荐和咨询连接系统。', boothNotice:'本服务不是医疗诊断，而是参考用皮肤分析辅助。', boothButton:'查看美容亭商业模式', premiumAccessConfirmed:'Premium Access 已确认', premiumPanelTitle:'釜山商品购买客户专属AI K-Beauty礼宾报告', premiumPanelDesc:'可查看比免费分析更详细的皮肤状态参考报告、K-Beauty流程、产品类别和韩国咨询准备清单。', premiumAnalyzeStart:'开始高级分析', qualityCheckBtn:'照片质量确认', overallScore:'综合皮肤状态分数', scanGoodsQr:'扫描商品QR', premiumReportView:'查看高级报告', qrTitle:'请扫描商品指南QR', qrStart:'开始扫描QR', qrCancel:'取消扫描', qrInvalid:'QR无效。请重新确认商品指南中的QR。' };
  Object.assign(translations.vi, { premiumPanelDesc:'Chụp ảnh khuôn mặt để xem báo cáo tham khảo tình trạng da chi tiết hơn, routine K-beauty, danh mục sản phẩm và checklist tư vấn tại Hàn Quốc.', privacyNotice:'Ảnh chụp chỉ được dùng làm tư liệu tham khảo để tạo báo cáo tình trạng da và mặc định không lưu lâu dài.', premiumConfirmText:'Tôi xác nhận đây là báo cáo tham khảo tình trạng da, không phải chẩn đoán y tế.', qualityChecking:'Đang kiểm tra chất lượng ảnh...', qualityCenter:'Khuôn mặt ở giữa màn hình', qualityLighting:'Ánh sáng không quá tối', qualityDistance:'Khuôn mặt không quá xa', qualityBlur:'Ảnh không bị rung nhiều', qualityMask:'Không đeo khẩu trang hoặc kính râm', qualityGood:'Chất lượng ảnh: Tốt', premiumLockTitle:'Báo cáo Premium đang khóa', premiumLockDesc:'Dựa trên ảnh vừa chụp, bạn có thể xem báo cáo AI K-beauty concierge chi tiết hơn. Quét QR trong hướng dẫn quà Busan để mở báo cáo Premium.', sevenScores:'7 điểm thành phần', topConcerns:'Top 5 mối quan tâm về da', zoneObservation:'Quan sát theo vùng khuôn mặt', morningRoutine:'Routine K-beauty buổi sáng', eveningRoutine:'Routine K-beauty buổi tối', weeklyCare:'Routine chăm sóc hằng tuần', productCategories:'Danh mục sản phẩm gợi ý', consultChecklist:'Checklist chuẩn bị tư vấn K-beauty / du lịch y tế Hàn Quốc', kBeautyConsult:'Đăng ký tư vấn K-beauty', medicalTourConsult:'Đăng ký tư vấn du lịch y tế Hàn Quốc', emailReport:'Nhận báo cáo qua email', backHome:'Quay lại VR MEDI TOUR', hydration:'Ước tính độ ẩm', oilBalance:'Cân bằng dầu', texture:'Độ đều bề mặt da', pores:'Độ thấy rõ lỗ chân lông', redSensitive:'Tín hiệu đỏ/nhạy cảm', toneEvenness:'Độ đều màu da', glow:'Độ rạng rỡ', needFreeCapture:'Cần chụp phân tích da miễn phí trước khi tạo báo cáo Premium.', premiumOpened:'Báo cáo Premium dành cho khách mua quà Busan đã mở.', premiumViewHint:'Nhấn Xem báo cáo Premium để tạo báo cáo chi tiết từ kết quả miễn phí mà không cần chụp lại.' });
  Object.assign(translations.ja, { privacyNotice:'撮影画像は肌コンディションレポート作成の参考資料としてのみ使用され、初期設定では長期保存されません。', premiumConfirmText:'本サービスは医療診断ではなく肌コンディション参考レポートであることを確認しました。', qualityChecking:'写真品質を確認中...', qualityCenter:'顔が画面中央にある', qualityLighting:'照明が暗すぎない', qualityDistance:'顔が遠すぎない', qualityBlur:'ブレが大きくない', qualityMask:'マスクやサングラスがない', qualityGood:'写真品質：良好', premiumLockTitle:'プレミアムレポートロック', premiumLockDesc:'今撮影した写真を基に、より詳しいAI Kビューティーコンシェルジュレポートを確認できます。釜山グッズ案内書のQRをスキャンすると開きます。', sevenScores:'7つのサブスコア', topConcerns:'肌悩みTOP 5', zoneObservation:'顔部位別観察', morningRoutine:'朝のKビューティールーティン', eveningRoutine:'夜のKビューティールーティン', weeklyCare:'週間ケアルーティン', productCategories:'おすすめ製品カテゴリー', consultChecklist:'韓国Kビューティー・医療観光相談準備チェックリスト', kBeautyConsult:'Kビューティー相談申請', medicalTourConsult:'韓国医療観光相談申請', emailReport:'レポートをメールで受け取る', backHome:'VR MEDI TOURホームへ戻る', hydration:'水分感推定', oilBalance:'油分バランス', texture:'肌きめ均一度', pores:'毛穴の見え方', redSensitive:'赤み・敏感サイン', toneEvenness:'トーン均一度', glow:'ツヤ・生気', needFreeCapture:'プレミアムレポート作成には先に無料肌分析撮影が必要です。', premiumOpened:'釜山グッズ購入者専用プレミアムレポートが開きました。', premiumViewHint:'プレミアムレポートを見るを押すと、再撮影せず無料分析結果を基に詳細レポートを作成します。' });
  Object.assign(translations.zh, { privacyNotice:'拍摄图像仅作为生成皮肤状态报告的参考资料，默认不长期保存。', premiumConfirmText:'我确认本服务是皮肤状态参考报告，不是医疗诊断。', qualityChecking:'正在确认照片质量...', qualityCenter:'脸部位于画面中央', qualityLighting:'光线不太暗', qualityDistance:'脸部距离不太远', qualityBlur:'抖动不严重', qualityMask:'未佩戴口罩或太阳镜', qualityGood:'照片质量：良好', premiumLockTitle:'高级报告已锁定', premiumLockDesc:'基于刚拍摄的照片，您可以查看更详细的AI K-Beauty礼宾报告。扫描釜山商品指南中的QR即可打开高级报告。', sevenScores:'7项子分数', topConcerns:'皮肤关注TOP 5', zoneObservation:'面部分区观察', morningRoutine:'早间K-Beauty流程', eveningRoutine:'晚间K-Beauty流程', weeklyCare:'每周护理流程', productCategories:'推荐产品类别', consultChecklist:'韩国K-Beauty·医疗旅游咨询准备清单', kBeautyConsult:'申请K-Beauty咨询', medicalTourConsult:'申请韩国医疗旅游咨询', emailReport:'通过邮件接收报告', backHome:'返回VR MEDI TOUR首页', hydration:'水分感估计', oilBalance:'油脂平衡', texture:'肤质均匀度', pores:'毛孔可见度', redSensitive:'泛红·敏感信号', toneEvenness:'肤色均匀度', glow:'光泽·活力', needFreeCapture:'生成高级报告前需要先完成免费皮肤分析拍摄。', premiumOpened:'釜山商品购买客户专属高级报告已开启。', premiumViewHint:'点击查看高级报告，即可基于免费分析结果生成详细报告，无需重新拍照。' });

  Object.assign(translations.en, {
    photoQualityTitle:'Photo quality assessment', lighting:'Lighting', facePosition:'Face position', clarity:'Clarity', note:'Reference note',
    interpretation:'Interpretation', careDirection:'Care direction', whyItMatters:'Why it matters', firstAction:'First action',
    medicalTourismPreparation:'Before medical-travel consultation', nextBestActions:'Next best actions', consultationCtaTitle:'Consultation CTA',
    premiumError:'An error occurred during the premium analysis request. Please try again later.',
    premiumAutoStarting:'BUSANBLUE verified: premium analysis will start automatically with the same photo.',
    premiumCtaDesc:'Use this premium report to request K-beauty routine guidance or prepare for a Korea visit consultation.',
  });
  Object.assign(translations.vi, {
    photoQualityTitle:'Đánh giá chất lượng ảnh', lighting:'Ánh sáng', facePosition:'Vị trí khuôn mặt', clarity:'Độ rõ nét', note:'Ghi chú tham khảo',
    interpretation:'Diễn giải', careDirection:'Hướng chăm sóc', whyItMatters:'Vì sao quan trọng', firstAction:'Việc nên làm đầu tiên',
    medicalTourismPreparation:'Chuẩn bị trước tư vấn du lịch y tế', nextBestActions:'Hành động tiếp theo', consultationCtaTitle:'CTA đăng ký tư vấn',
    premiumError:'Đã xảy ra lỗi khi yêu cầu phân tích Premium. Vui lòng thử lại sau.',
    premiumAutoStarting:'Đã xác thực BUSANBLUE: phân tích Premium sẽ tự động bắt đầu với cùng ảnh.',
    premiumCtaDesc:'Sử dụng báo cáo Premium này để yêu cầu tư vấn routine K-beauty hoặc chuẩn bị tư vấn khi đến Hàn Quốc.',
  });
  Object.assign(translations.ja, {
    photoQualityTitle:'写真品質評価', lighting:'照明', facePosition:'顔の位置', clarity:'鮮明度', note:'参考メモ',
    interpretation:'解釈', careDirection:'ケア方向', whyItMatters:'重要な理由', firstAction:'最初のアクション',
    medicalTourismPreparation:'医療観光相談前の準備事項', nextBestActions:'次のおすすめ行動', consultationCtaTitle:'相談申請CTA',
    premiumError:'プレミアム分析リクエスト中にエラーが発生しました。しばらくしてからもう一度お試しください。',
    premiumAutoStarting:'BUSANBLUE認証成功：同じ写真でプレミアム分析を自動開始します。',
    premiumCtaDesc:'このプレミアムレポートを基に、Kビューティールーティン相談または韓国訪問相談の準備を依頼できます。',
  });
  Object.assign(translations.zh, {
    photoQualityTitle:'照片质量评估', lighting:'光线', facePosition:'面部位置', clarity:'清晰度', note:'参考备注',
    interpretation:'解读', careDirection:'护理方向', whyItMatters:'重要原因', firstAction:'第一步行动',
    medicalTourismPreparation:'医疗旅游咨询前准备事项', nextBestActions:'下一步建议行动', consultationCtaTitle:'咨询申请 CTA',
    premiumError:'高级分析请求发生错误。请稍后再试。',
    premiumAutoStarting:'BUSANBLUE 验证成功：将使用同一张照片自动开始高级分析。',
    premiumCtaDesc:'可根据此高级报告申请 K-Beauty 流程咨询，或为韩国访问咨询做准备。',
  });
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
        const rawError = json.error || json.message;
        if (requestPremium) console.error('Premium skin analysis failed:', rawError, json);
        const m = requestPremium ? t('premiumError') : mapMessage(rawError);
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
    } catch (error) {
      if (requestPremium) console.error('Premium skin analysis failed:', error);
      else console.error('Skin analysis failed:', error);
      const m = requestPremium ? t('premiumError') : t('errServer');
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
    const observations = (a.observations || []).slice(0, 3);
    const care = [
      ...(a.care_priority || []).slice(0, 2),
      ...(a.recommended_product_direction || []).slice(0, 2),
    ].slice(0, 3);
    analysis.innerHTML = `
      <h2>${esc(t('reportTitle'))}</h2>
      <div class="report-grid report-grid--free">
        <div class="report-item"><strong>${esc(t('skinSummary'))}</strong><p>${esc(a.summary || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('imageQuality'))}</strong><p>${esc(String(a.confidence ?? '-'))}</p></div>
        <div class="report-item"><strong>${esc(t('carePriority'))}</strong><ul>${li(observations.length ? observations : ['-'])}</ul></div>
        <div class="report-item"><strong>${esc(t('productDirection'))}</strong><ul>${li(care.length ? care : ['-'])}</ul></div>
      </div>
      <div class="premium-info-card">
        <strong>${esc(t('premiumLockTitle'))}</strong>
        <p>${esc(t('premiumLockDesc'))}</p>
        <button id="vrmtOpenQrScanBtn" class="btn primary" type="button">${esc(t('scanGoodsQr'))}</button>
      </div>
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
      <section class="score-card premium-score-card">
        <div><span>${esc(t('overallScore'))}</span><strong>${premium.overallScore}</strong><em>/ 100</em></div>
        <p>${esc(premium.summary)}</p>
      </section>
      <section class="premium-section"><h3>${esc(t('photoQualityTitle'))}</h3><div class="photo-quality-grid">${photoQualityItems(premium.photoQuality)}</div></section>
      <section class="premium-section"><h3>${esc(t('sevenScores'))}</h3><div class="score-grid premium-score-grid">${scoreBars(premium.subScores)}</div></section>
      <section class="premium-section"><h3>${esc(t('topConcerns'))}</h3><div class="concern-grid">${concernItems(premium.topConcerns)}</div></section>
      <section class="premium-section"><h3>${esc(t('zoneObservation'))}</h3><div class="zone-grid">${zoneItems(premium.zoneAnalysis)}</div></section>
      <section class="premium-section routine-grid">
        <div><h3>${esc(t('morningRoutine'))}</h3><ol>${routineItems(premium.morningRoutine)}</ol></div>
        <div><h3>${esc(t('eveningRoutine'))}</h3><ol>${routineItems(premium.eveningRoutine)}</ol></div>
        <div><h3>${esc(t('weeklyCare'))}</h3><ul>${weeklyItems(premium.weeklyCare)}</ul></div>
        <div><h3>${esc(t('nextBestActions'))}</h3><ul>${li(premium.nextBestActions)}</ul></div>
      </section>
      <section class="premium-section"><h3>${esc(t('productCategories'))}</h3><div class="premium-detail-grid">${productItems(premium.productCategories)}</div></section>
      <section class="premium-section routine-grid">
        <div><h3>${esc(t('consultChecklist'))}</h3><ul>${checklistItems(premium.koreaConsultChecklist)}</ul></div>
        <div><h3>${esc(t('medicalTourismPreparation'))}</h3><ul>${checklistItems(premium.medicalTourismPreparation)}</ul></div>
      </section>
      <section class="premium-section premium-cta-card">
        <h3>${esc(t('consultationCtaTitle'))}</h3>
        <p>${esc(t('premiumCtaDesc'))}</p>
        <div class="premium-cta-row">
          <a class="btn primary" href="/#consultation?source=BUSANBLUE">${esc(t('kBeautyConsult'))}</a>
          <a class="btn primary" href="/#consultation?source=BUSANBLUE-medical">${esc(t('medicalTourConsult'))}</a>
          <a class="btn" href="/#consultation?source=BUSANBLUE-report">${esc(t('emailReport'))}</a>
          <a class="btn" href="/">${esc(t('backHome'))}</a>
        </div>
      </section>
      <p class="privacy-notice">${esc(privacyNotice)}</p>
      <p class="safety">${esc(premium.disclaimer || medicalSafetyNotice)}</p>
      <p class="safety">${esc(t('languageNotice'))}</p>`;
  }

  function noticeMarkup(includePrivacy = false) {
    return `${includePrivacy ? `<p class="privacy-notice">${esc(privacyNotice)}</p>` : ''}<p class="safety">${esc(medicalSafetyNotice)}</p><p class="safety">${esc(t('languageNotice'))}</p>`;
  }

  function normalizePremiumAnalysis(a) {
    const defaultScore = (score, label, interpretation, careDirection) => ({ score, label, interpretation, careDirection });
    const scoreObj = (value, fallback) => {
      if (typeof value === 'number') return { ...fallback, score: pct(value, fallback.score) };
      return {
        score: pct(value?.score, fallback.score),
        label: value?.label || fallback.label,
        interpretation: value?.interpretation || fallback.interpretation,
        careDirection: value?.careDirection || fallback.careDirection,
      };
    };
    const zoneObj = (value, observation, careDirection) => (typeof value === 'string'
      ? { observation: value, careDirection }
      : { observation: value?.observation || observation, careDirection: value?.careDirection || careDirection });
    const routineObj = (value, index, title, reason) => (typeof value === 'string'
      ? { step: index + 1, title: value, reason }
      : { step: value?.step || index + 1, title: value?.title || title, reason: value?.reason || reason });
    const weeklyObj = (value, frequency, title, reason) => (typeof value === 'string'
      ? { frequency, title: value, reason }
      : { frequency: value?.frequency || frequency, title: value?.title || title, reason: value?.reason || reason });
    const productObj = (value, category, purpose, caution) => (typeof value === 'string'
      ? { category: value, purpose, caution }
      : { category: value?.category || category, purpose: value?.purpose || purpose, caution: value?.caution || caution });
    const checklistObj = (value, item, reason) => (typeof value === 'string'
      ? { item: value, reason }
      : { item: value?.item || item, reason: value?.reason || reason });

    const scoreFallbacks = {
      hydration: defaultScore(68, t('hydration'), '볼과 입가의 수분감이 일정하지 않을 수 있어 기본 보습 루틴 점검이 도움이 됩니다.', '세안 직후 수분 토너와 보습 크림을 얇게 겹쳐 바르고, 낮에는 자외선 차단 루틴을 함께 유지하세요.'),
      oilBalance: defaultScore(72, t('oilBalance'), 'T존과 볼 부위의 번들거림 차이를 함께 보며 유분 밸런스 관리가 필요할 수 있습니다.', '가벼운 젤 제형과 크림 제형을 부위별로 조절하고, 세안 강도를 과하게 높이지 않는 방향을 권장합니다.'),
      texture: defaultScore(66, t('texture'), '피부결은 조명과 각도 영향을 받지만 표면 균일도 관리 포인트가 보입니다.', '주 1회 정도 부드러운 피부결 관리 제품 카테고리를 확인하고 보습 장벽을 먼저 안정적으로 유지하세요.'),
      pores: defaultScore(61, t('pores'), '코 주변과 볼 중앙의 모공 가시성은 사진에서 비교적 눈에 띄는 관리 포인트입니다.', '피지 관리 제품은 저자극 카테고리부터 확인하고, 충분한 보습으로 건조한 번들거림을 줄이는 방향이 좋습니다.'),
      redness: defaultScore(70, t('redSensitive'), '일부 부위에 붉은기 신호처럼 보이는 색 변화가 있어 순한 루틴이 적합합니다.', '새 제품은 작은 부위에 먼저 확인하고, 향이나 강한 사용감의 제품은 상담 전 목록으로 정리해 주세요.'),
      toneEvenness: defaultScore(69, t('toneEvenness'), '얼굴 중심부와 외곽의 톤 균일도 차이가 관찰될 수 있습니다.', '자외선 차단과 수분 루틴을 기본으로 두고, 톤 케어 제품 카테고리는 낮은 자극 방향으로 선택하세요.'),
      glow: defaultScore(67, t('glow'), '광채와 생기는 수분감, 조명, 표면 반사에 영향을 받아 중간 수준으로 참고할 수 있습니다.', '아침에는 가벼운 수분 레이어링, 저녁에는 보습 마무리로 촬영 전후 변화를 기록해 보세요.'),
    };
    const scores = Object.fromEntries(Object.entries(scoreFallbacks).map(([key, fallback]) => [key, scoreObj(a.subScores?.[key], fallback)]));
    return {
      overallScore: pct(a.overallScore, Math.round((Number(a.confidence) || 0.72) * 100)),
      summary: a.summary || '촬영 이미지에서 확인 가능한 피부 컨디션을 기준으로 수분 관리, 유분 밸런스, 피부결, 모공 가시성, 톤 균일도 중심의 K-뷰티 실행 방향을 정리했습니다. 이 리포트는 상담 전 준비를 돕는 참고 자료로 활용할 수 있습니다.',
      photoQuality: {
        status: a.photoQuality?.status || 'fair',
        lighting: a.photoQuality?.lighting || '조명은 전체 윤곽 확인에는 충분하지만 일부 그림자에 따라 톤 균일도 해석은 참고 범위로 보아야 합니다.',
        facePosition: a.photoQuality?.facePosition || '얼굴이 가이드 안에 들어온 상태를 기준으로 하며, 정면 각도가 안정적일수록 부위별 비교가 더 쉬워집니다.',
        clarity: a.photoQuality?.clarity || a.photoQuality?.note || '선명도는 피부결과 모공 가시성을 참고하기에 무리가 없지만, 흔들림이 적은 재촬영이면 더 안정적인 비교가 가능합니다.',
        note: a.photoQuality?.note || '사진 품질 평가는 리포트 신뢰도를 이해하기 위한 참고 항목이며 결과를 단정적으로 해석하지 않습니다.',
      },
      subScores: scores,
      topConcerns: normalizeList(a.topConcerns, 5).map((v, i) => (typeof v === 'string'
        ? { rank: i + 1, concern: v, whyItMatters: '무료 분석보다 자세히 보기 위해 우선 관리할 피부 컨디션 포인트로 정리했습니다.', firstAction: '현재 루틴에서 같은 목적의 제품을 하나만 선택해 1~2주 단위로 변화를 기록해 보세요.' }
        : { rank: v?.rank || i + 1, concern: v?.concern || `피부 컨디션 관리 포인트 ${i + 1}`, whyItMatters: v?.whyItMatters || '해당 포인트는 수분 관리와 유분 밸런스, 피부결 인상에 함께 영향을 줄 수 있어 우선순위로 확인하면 좋습니다.', firstAction: v?.firstAction || '아침과 저녁 루틴에서 자극을 줄이고 보습 지속감을 먼저 점검해 보세요.' })),
      zoneAnalysis: {
        forehead: zoneObj(a.zoneAnalysis?.forehead, '이마는 번들거림과 건조감이 함께 느껴질 수 있는 부위로 보입니다.', '가벼운 수분 제품을 먼저 사용하고 필요 시 유분이 적은 보습제로 마무리하세요.'),
        cheeks: zoneObj(a.zoneAnalysis?.cheeks, '양 볼은 수분감과 붉은기 신호를 함께 확인할 수 있는 핵심 부위입니다.', '진정 카테고리와 장벽 보습 카테고리를 중심으로 순한 루틴을 구성하세요.'),
        nose: zoneObj(a.zoneAnalysis?.nose, '코 주변은 유분 밸런스와 모공 가시성이 비교적 잘 드러나는 영역입니다.', '강한 세정보다는 꾸준한 클렌징과 수분 보충을 병행하는 방향이 적합합니다.'),
        mouthArea: zoneObj(a.zoneAnalysis?.mouthArea, '입가는 표정 움직임과 건조감 영향을 쉽게 받는 부위입니다.', '저녁 루틴에서 보습 크림을 얇게 덧바르고 마찰을 줄이는 습관을 권장합니다.'),
        chin: zoneObj(a.zoneAnalysis?.chin, '턱은 마찰과 유분 변화가 겹쳐 피부결 인상이 달라질 수 있습니다.', '마스크나 손 접촉을 줄이고 세안 후 보습 마무리를 안정적으로 유지하세요.'),
        eyeArea: zoneObj(a.zoneAnalysis?.eyeArea, '눈가는 얇고 건조감을 느끼기 쉬운 부위로 섬세한 보습 관리가 필요합니다.', '무거운 사용감보다 가벼운 보습과 낮 시간 자외선 차단 루틴을 우선하세요.'),
      },
      morningRoutine: normalizeList(a.morningRoutine, 4).map((v, i) => routineObj(v, i, ['저자극 세안','수분 레이어링','밸런스 보습','자외선 차단'][i] || '아침 루틴', '아침에는 과한 단계보다 수분감과 보호 루틴을 안정적으로 유지하는 것이 피부 컨디션 참고 관리에 도움이 됩니다.')),
      eveningRoutine: normalizeList(a.eveningRoutine, 4).map((v, i) => routineObj(v, i, ['클렌징 정리','수분·진정 세럼','장벽 보습','변화 기록'][i] || '저녁 루틴', '저녁에는 하루 동안의 자극 요인을 정리하고 다음 날 컨디션을 비교할 수 있도록 보습과 기록을 병행하세요.')),
      weeklyCare: normalizeList(a.weeklyCare, 3).map((v, i) => weeklyObj(v, ['주 1~2회','주 1회','상담 전'][i] || '주간', ['수분 마스크','피부결 관리','제품 목록 정리'][i] || '주간 케어', '주간 케어는 매일 루틴을 방해하지 않는 범위에서 변화를 관찰하는 방식으로 진행하는 것이 좋습니다.')),
      productCategories: normalizeList(a.productCategories, 5).map((v, i) => productObj(v, ['수분 토너','진정 세럼','장벽 보습 크림','저자극 클렌저','데일리 자외선 차단제'][i] || '제품 카테고리', '현재 사진에서 보이는 피부 컨디션을 기준으로 루틴 목적을 분명히 하기 위한 카테고리입니다.', '새 카테고리는 한 번에 여러 개를 추가하지 말고 사용감과 변화를 기록하세요.')),
      koreaConsultChecklist: normalizeList(a.koreaConsultChecklist, 5).map((v, i) => checklistObj(v, ['현재 사용하는 제품 사진 준비','피부 컨디션 변화 시기 메모','원하는 K-뷰티 루틴 목표 정리','상담 가능 일정과 언어 요청','사진·리포트 공유 동의 범위 확인'][i] || '상담 준비 항목', '상담 전 준비가 명확할수록 제품 카테고리와 루틴 방향을 더 구체적으로 논의할 수 있습니다.')),
      medicalTourismPreparation: normalizeList(a.medicalTourismPreparation, 4).map((v, i) => checklistObj(v, ['방문 일정 후보 정리','기존 루틴과 민감 반응 메모','통역 또는 언어 지원 요청','예산과 희망 상담 범위 정리'][i] || '방문 상담 준비', '한국 방문 상담을 고려한다면 일정, 언어, 공유 자료 범위를 미리 정리해 상담 흐름을 편하게 만들 수 있습니다.')),
      nextBestActions: normalizeList(a.nextBestActions, 3).map((v, i) => typeof v === 'string' ? v : (v?.item || ['오늘 무료 분석 사진과 프리미엄 리포트를 함께 저장해 상담 전 참고 자료로 활용하세요.','아침·저녁 루틴에서 제품을 한 번에 많이 바꾸지 말고 핵심 카테고리부터 점검하세요.','K-뷰티 상담 신청 시 현재 루틴과 원하는 피부 컨디션 목표를 함께 전달하세요.'][i])),
      disclaimer: a.disclaimer || '본 리포트는 의료 진단이 아닌 비의료적 피부 컨디션 참고 자료입니다.',
    };
  }

  function normalizeList(value, minLength) {
    const arr = Array.isArray(value) ? value.slice() : [];
    while (arr.length < minLength) arr.push(null);
    return arr;
  }

  function scoreBars(scores) {
    return Object.entries(scores).map(([key, item]) => `<div class="score-row premium-score-row"><span>${esc(item.label || t(key))}</span><strong>${item.score}</strong><i style="--score:${item.score}%"></i><p><b>${esc(t('interpretation'))}</b> ${esc(item.interpretation)}</p><p><b>${esc(t('careDirection'))}</b> ${esc(item.careDirection)}</p></div>`).join('');
  }

  function photoQualityItems(photoQuality) {
    return [
      ['status', 'Status'], ['lighting', t('lighting')], ['facePosition', t('facePosition')], ['clarity', t('clarity')], ['note', t('note')],
    ].map(([key, label]) => `<div class="report-item"><strong>${esc(label)}</strong><p>${esc(photoQuality[key])}</p></div>`).join('');
  }

  function concernItems(items) {
    return items.map((item) => `<article class="report-item concern-card"><strong>${esc(item.rank)}. ${esc(item.concern)}</strong><p><b>${esc(t('whyItMatters'))}</b> ${esc(item.whyItMatters)}</p><p><b>${esc(t('firstAction'))}</b> ${esc(item.firstAction)}</p></article>`).join('');
  }

  function zoneItems(zones) {
    const labels = { forehead: t('forehead'), cheeks: t('cheeks'), nose: t('nose'), mouthArea: t('mouthArea'), chin: t('chin'), eyeArea: t('eyeArea') };
    return Object.entries(labels).map(([key, label]) => `<div class="report-item"><strong>${label}</strong><p>${esc(zones[key].observation)}</p><p><b>${esc(t('careDirection'))}</b> ${esc(zones[key].careDirection)}</p></div>`).join('');
  }

  function routineItems(items) {
    return items.map((item) => `<li><strong>${esc(item.step)}. ${esc(item.title)}</strong><p>${esc(item.reason)}</p></li>`).join('');
  }

  function weeklyItems(items) {
    return items.map((item) => `<li><strong>${esc(item.frequency)} · ${esc(item.title)}</strong><p>${esc(item.reason)}</p></li>`).join('');
  }

  function productItems(items) {
    return items.map((item) => `<article class="report-item"><strong>${esc(item.category)}</strong><p>${esc(item.purpose)}</p><p><b>Caution</b> ${esc(item.caution)}</p></article>`).join('');
  }

  function checklistItems(items) {
    return items.map((item) => `<li><strong>${esc(item.item)}</strong><p>${esc(item.reason)}</p></li>`).join('');
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

  function unlockPremiumAccess({ autoRun = false } = {}) {
    premiumUnlocked = true;
    renderModeShell();
    document.body.classList.add('premium-mode');
    document.body.classList.remove('free-mode');
    statusEl.textContent = autoRun ? t('premiumAutoStarting') : t('premiumAccessConfirmed');
    preparePremiumReportAfterAuth();
    bindPremiumControlEvents();
    if (autoRun && pendingPremiumImage && qualityReady && premiumConfirm?.checked) {
      runPremiumAnalysis();
    }
  }

  function completePremiumQrUnlock(scannedText = '') {
    stopQrScanner();
    try { sessionStorage.setItem(premiumAccessStorageKey, premiumAccessCode); } catch (_) {}
    try {
      const url = new URL(window.location.href);
      url.pathname = '/ai-skin/';
      url.searchParams.set('premium', premiumAccessCode);
      window.history.replaceState({}, '', url.toString());
    } catch (_) {}
    document.getElementById('vrmtQrScanModal')?.remove();
    unlockPremiumAccess({ autoRun: true });
  }

  function isValidBusanBlueQr(scannedText) {
    if (!scannedText) return false;
    const text = String(scannedText).trim();
    if (text.includes(premiumAccessCode)) return true;
    if (text.includes(`premium=${premiumAccessCode}`)) return true;
    try {
      const url = new URL(text);
      return url.searchParams.get('premium') === premiumAccessCode;
    } catch (_) {
      return false;
    }
  }

  function isValidPremiumQr(value) {
    return isValidBusanBlueQr(value);
  }

  function stopQrScanner() {
    if (qrScanTimer) cancelAnimationFrame(qrScanTimer);
    qrScanTimer = null;
    qrScanStream?.getTracks().forEach((track) => track.stop());
    qrScanStream = null;
  }

  function resetQrScanResult() {
    const result = document.getElementById('vrmtQrScanResult');
    if (!result) return;
    result.textContent = '';
    result.hidden = true;
    result.className = 'qr-scan-result';
  }

  function showQrResult(message, ok = false) {
    const result = document.getElementById('vrmtQrScanResult');
    if (!result) return;
    result.hidden = !message;
    result.className = ok ? 'qr-scan-result success' : 'qr-scan-result error';
    result.textContent = message || '';
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
              completePremiumQrUnlock(raw);
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
        <p id="vrmtQrScanResult" class="qr-scan-result" hidden></p>
        <div class="actions qr-scan-actions">
          <button id="vrmtStartQrScanBtn" class="btn primary" type="button">${esc(t('qrStart'))}</button>
          <button id="vrmtCancelQrScanBtn" class="btn" type="button">${esc(t('qrCancel'))}</button>
          <button id="vrmtQrPremiumViewBtn" class="btn primary" type="button" disabled>${esc(t('premiumReportView'))}</button>
        </div>
        <details class="qr-manual-code"><summary>${esc(t('qrManualSummary'))}</summary><input id="vrmtQrManualCode" type="text" autocomplete="off" placeholder="${esc(t('qrManualPlaceholder'))}" /><button id="vrmtQrManualSubmitBtn" class="btn" type="button">${esc(t('confirmBtn'))}</button></details>
      </div>`;
    document.body.appendChild(modal);
    resetQrScanResult();
    modal.querySelector('#vrmtStartQrScanBtn')?.addEventListener('click', startQrScanner);
    modal.querySelector('#vrmtCancelQrScanBtn')?.addEventListener('click', () => { stopQrScanner(); modal.remove(); });
    modal.querySelector('#vrmtQrPremiumViewBtn')?.addEventListener('click', () => completePremiumQrUnlock(premiumAccessCode));
    modal.querySelector('#vrmtQrManualSubmitBtn')?.addEventListener('click', () => {
      const value = modal.querySelector('#vrmtQrManualCode')?.value || '';
      if (isValidPremiumQr(value)) {
        completePremiumQrUnlock(value);
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
