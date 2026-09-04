/* 場面: 13年の道（/life/ の内容を歩く）。../road/engine.js より先に読む
   ・章の板は road.html にある。ここでは街と、道ぞいの標識（年表）を組む
   ・年 → 道の位置 の対応表で、企画364件から拾った32件を道ぞいに立てる。年ごとの標識からは、その年の全件が写真つきで見られる */
(function(){
'use strict';

/* 年表。/life/ の結びにある「13年でやってきたこと」の代表32件。開催日・場所・説明・写真は企画一覧PDFから */
var EVENTS = [{"n": "みんなでお尻愛プロジェクト（平成30年7月豪雨 給水支援）", "y": "2018", "d": "2018年7月12日〜8月3日(約3週間、断水解除まで)", "p": "広島県呉市川尻町ほか安浦エリア", "t": "断水地域の高齢者・身体不自由な世帯を1軒ずつ訪問し生活用水を配布。毎日1000リットル近くを配水。polcaで300円から支援を募り、初日〜2日で10万円近い支援。NHK・毎日新聞・RCCラジオが報道。", "ev": "根拠の投稿:2018-07-11、2018-07-12、2018-07-13、2018-07-15、2018-07-16、2018-07-19、2018-07-22、2018-07-23、2018-07-25、2018-07-29、2018-08-03", "im": ["ev/12.jpg", "ev/13.jpg", "ev/14.jpg"], "po": []}, {"n": "Free Food Project（フリーフードプロジェクト）", "y": "2018", "d": "第1回2018年8月17日、第2回9月28日(いずれも13時〜)", "p": "広島県呉市クレテリア(呉市中央公園・蔵本通り沿い)", "t": "キッチンカー事業者から1日1万円分の商品を買い取り被災地で無料配布する支援企画。呉市の後援を得て開催、キッチンカー3台が参加。第1回はかき氷を無料配布し17時に完売、第2回はフランクフルト等を配布し呉市のキャラクターも1時間登場。テレビ番組でも紹介。", "ev": "根拠の投稿:2018-07-24、2018-08-01、2018-08-09、2018-08-16、2018-08-17、2018-09-21、2018-09-23", "im": ["ev/21.jpg", "ev/20.jpg", "ev/22.jpg"], "po": []}, {"n": "緊急登庁保育支援", "y": "2021", "d": "2021年2月24日 開始発表、2月27日 事務局立ち上げ", "p": "広島県(陸上自衛隊・海上自衛隊と連携した研修プログラム)", "t": "災害派遣員のパパママ隊員の子を預かる24時間体制の臨時保育施設を、発災後最大120時間(24時間×5日間、交代制)開設。保育有資格者・保育系学生の支援員を募集", "ev": "根拠の投稿:2021-02-24、2021-02-27、2021-08-27", "im": ["ev/28.jpg", "ev/29.jpg", "ev/30.jpg"], "po": []}, {"n": "災害対応型モビリティの構想", "y": "2024", "d": "2024年1月12日(関東の製造拠点で型を確認)", "p": "関東の製造拠点/広島", "t": "地震の教訓から、1水を98%浄水して再利用し災害時は簡易給水所になる 2太陽光発電+蓄電池で移動型発電所になる、2機能を持つモデルを構想。スポンサー・協力企業を募集した。", "ev": "根拠の投稿:2024-01-12", "im": ["ev/34.jpg", "ev/35.jpg"], "po": []}, {"n": "オンライン自宅学習支援「ハウスタ！」", "y": "2020", "d": "2020-06-09〜07-10の火曜・金曜 15:30〜17:30", "p": "オンライン(廿日市市・広島県内)", "t": "小学生全学年を対象に県内の現役大学生が家庭教師のように学習を支援。料金は1時間500円だが実証実験期間は無料、大学生のバイト代はカンパで賄い、6名前後の大学生が講師として参加。中国新聞などが取材。", "ev": "根拠の投稿:2020-05-18、2020-05-20、2020-05-27、2020-05-31、2020-06-02、2020-06-09、2020-06-10、2020-06-12", "im": ["ev/36.jpg", "ev/37.jpg", "ev/38.jpg"], "po": [["2020-05-18", "新しく始めた「地域の困りごと」を支援するプロジェクト。 実証実験に掛かる全ての費用は僕らで負担するつもりですが、 もし、この活動に共感して頂ける方がいれば是非カンパにご協力ください！ 困っている方々の支援の為に500円からカンパできますので、 どうぞよろしくお願い致します。"]]}, {"n": "佐伯・吉和エリア観光看板の設置", "y": "2021", "d": "2020年度末に設置完了、2021年4月18日に報告", "p": "廿日市市 佐伯総合スポーツ公園、岩倉キャンプ場", "t": "看板をWEBと連動させスマホで地域情報が見られる仕組み。地元高校生や高齢者が季節情報を発信できる設計。今年度はスポンサー募集やクラウドファンディングで運営継続を計画", "ev": "根拠の投稿:2021-04-18", "im": ["ev/44.jpg", "ev/45.jpg", "ev/46.jpg"], "po": []}, {"n": "学生応援プロジェクト【美容版】", "y": "2021", "d": "2021年10月1日 募集開始、11月1日 申請受理", "p": "広島市内の美容室・理容院(20店舗限定)", "t": "学生限定メニューを最大50%off、その50%off分は事務局が負担し、店にはインフルエンサーによる拡散とPRを提供。広島市に住所がある学生が優先、募集は20店舗限定", "ev": "根拠の投稿:2021-10-01、2021-10-05、2021-11-01", "im": ["ev/55.jpg", "ev/56.jpg"], "po": []}, {"n": "ワーキングマザー＆ファザーの働く環境改革（子育て世代の働き方支援）", "y": "2021", "d": "2021年5月に構想・アンケート開始、8ヶ月の調査を経て11月25日に検証内容を公表", "p": "広島県廿日市市ほか", "t": "知事・市⻑との座談会で挙がった課題が起点。PTAや保育園の保護者会経由でアンケートを実施し、保育料・移動時間・スキル・再就職・社会との繋がりの5課題を抽出、解決策を試験検証中", "ev": "企画・調査主導(廿日市市の若手経営者、後に広島県商工労働局へも協力依頼)根拠の投稿:2021-05-25、2021-05-28、2021-05-29、2021-11-25、2021-11-27", "im": ["ev/49.jpg", "ev/51.jpg", "ev/52.jpg"], "po": []}, {"n": "第2回 吉和ココから塾 広島×吉和つながるトーク2021", "y": "2021", "d": "2021年1月27日 13:30〜15:30(告知は1月22日)", "p": "オンライン", "t": "吉和と広島の企業をマッチングするイベントを告知。「この1年、煙たがられながらオンラインの必要性を説いてきた成果」と廿日市市でのオンライン定着に触れている。", "ev": "根拠の投稿:2021-01-22、2021-01-27", "im": ["ev/123.jpg", "ev/122.jpg"], "po": []}, {"n": "事業再構築補助金活用セミナー", "y": "2022", "d": "2022年5月13日(金)", "p": "廿日市商工会議所(リアル+Zoom)", "t": "前年は繋がりで41事業者が計画書を作成し第4期までの採択率75%。会場は残り10名+Zoom枠を追加。特許出願予定のビジネスモデルを初披露", "ev": "根拠の投稿:2022-04-21、2022-04-28、2022-05-12", "im": ["ev/129.jpg", "ev/130.jpg", "ev/131.jpg"], "po": []}, {"n": "新規事業開発の講演会（「ゼクシィ」生みの親・渡瀬ひろみさんを招へい）", "y": "2022", "d": "2022年10月24日(月)17:30〜19:00", "p": "CLiP HIROSHIMA(広島市中区東千田町)", "t": "参加費無料・先着50名・事前予約制。新規事業開発のプロセス、広島の観光産業の可能性、参入アドバイスのグループワークの5部構成", "ev": "根拠の投稿:2022-10-09、2022-10-25", "im": ["ev/137.jpg"], "po": []}, {"n": "『論語と算盤』をテーマにした講演会・会合", "y": "2022", "d": "2022年11月26日(講演)・11月27日(面会報告)", "p": "広島商工会議所", "t": "渋沢栄一の子孫による講演を聴講。前日にYouTubeで予習し「胸に刺さって眠れなかった」と記す。翌日は本人が声を掛けた2名を含む場で対話し、社会的投資ファンド政策の現況を聞いた。", "ev": "根拠の投稿:2022-11-26、2022-11-27", "im": ["ev/141.jpg", "ev/142.jpg", "ev/143.jpg"], "po": []}, {"n": "空家の学校", "y": "2017–2019", "d": "2017年09月〜2019年05月(25件の記録)", "p": "レインボー倉庫広島", "t": "空き家に関する連続講座。2/14に「vol.2 家の仕組み〜戦後の木造住宅編〜」をHP更新。5/19(14:30開場15:00開始16:30終了)は兵庫県たつの市で空き家相談センターを設立したNPO理事を招き、行政の巻き込み方を講義。参加費2,000円、定員20名。", "ev": "根拠の投稿:2017-09-13、2017-09-14、2017-10-02、2017-10-08、2017-11-15、2017-11-28、2017-11-30、2017-12-12、2017-12-27、2018-01-22、2018-01-31、2018-02-01 ほか13件", "im": ["ev/205.jpg", "ev/206.jpg", "ev/207.jpg"], "po": [["2017-12-12", "昨日は株式会社住宅デザイン研究所の金堀 一郎先生のところへ三澤 正明校長と今後の「空家の学校」についてご相談に伺ってきました。 リフォームされたオフィスは木の暖かみが感じられてとても居心地が良く、景観も最高でした！ 肝心な今後の学校の内容についても素敵な提案を頂く事ができました^ ^ 来年度の「空家の学校」もおもしろくなりそうです！ どうぞお楽しみに♪"]]}, {"n": "廿学（はつがく）", "y": "2020–2022", "d": "2020年07月〜2022年11月(28件の記録)", "p": "廿日市市/オンライン(YouTube配信・ZOOM)", "t": "廿日市市の魅力を先生役のゲストから学ぶWebサイトと授業。第1回は8月1日10時からルバーブがテーマ、9月20日の秋のオンライン特別講座は7時間で出入り自由、11月・12月はシンガーソングライターやけん玉メーカーが登壇。", "ev": "根拠の投稿:2020-07-16、2020-07-28、2020-08-01、2020-09-02、2020-09-15、2020-09-16、2020-09-20、2020-11-12、2020-11-20、2020-12-14、2020-12-20、2021-02-18 ほか16件", "im": ["ev/295.jpg", "ev/296.jpg", "ev/297.jpg"], "po": [["2020-11-12", "5年前 週末はレインボー倉庫横浜のプレオープンのお手伝いへ。 レインボー倉庫の中でも最大サイズの建物で内装の完成度はもちろん眺望も抜群‼️ オフィスとしての設備も整っているので出張のついでに立ち寄って頂いても大丈夫ですよー🙆‍♂️ 広島から施設の視察に行きたい！などの要望がありましたらご相談くださいませ。 できる限りご案内致します🙂"]]}, {"n": "ポートマルシェ内「おけいこハウス」お教室", "y": "2015", "d": "2015年9月〜10月4日回", "p": "広島市中区 十日市町(ポートマルシェ会場)", "t": "マルシェ開催中に3つの教室を実施。脳の仕組みを使う片づけ術、初心者向けゲーム式英会話、栄養士が教える酵素シロップ。", "ev": "根拠の投稿:2015-09-16", "im": [], "po": []}, {"n": "海図ワークショップ", "y": "2016", "d": "2016年6月26日", "p": "バックパッカーズ宮島", "t": "海図を使った財布づくりを体験できるワークショップ。宮島口マルシェの企画として呉から出店チームが登場。写真3枚。", "ev": "根拠の投稿:2016-06-23、2016-06-26", "im": ["ev/162.jpg", "ev/163.jpg", "ev/164.jpg"], "po": []}, {"n": "さとやま未来博2017 説明会", "y": "2016", "d": "2016年7月16日 夕方", "p": "記載なし", "t": "午前は宮島口でグランピング関連の打ち合わせ、夕方から説明会へ。グランピング企画を通じて里山の盛り上がりに貢献できそうだと記す。", "ev": "根拠の投稿:2016-07-16", "im": ["ev/354.jpg", "ev/157.jpg", "ev/355.jpg"], "po": [["2016-07-16", "今日は午前中からグランピング関連でワクワクするお話しを宮島口でさせてもらいました♫ そして夕方からはさとやま未来博2017の説明会へ！ こちらでもグランピング企画を通じて里山の盛り上がりに貢献できそうでワクワクです！ 個人としてもetc.CARAVANとしてもより楽しんで活動していきます！"]]}, {"n": "グランピング候補地・物産施設の視察", "y": "2016", "d": "2016年2月〜9月", "p": "大分県 湯布院、山口県 道の駅上関海峡、瀬戶内海の島々", "t": "2月に湯布院のフローラルヴィレッジと観光関連施設を視察。2月28日は道の駅上関海峡(その月4カ所目の道の駅)。7月と9月にはグランピング適地として瀬戶内の島を複数巡る。", "ev": "根拠の投稿:2016-02-08、2016-02-28、2016-07-30、2016-09-25", "im": ["ev/351.jpg", "ev/352.jpg", "ev/353.jpg"], "po": [["2016-09-25", "今日はグランピングに適した場所をご紹介していただけるとゆうことで、瀬戸内海のとある島をご案内していただきました(^ ^) いくつかの候補を巡りましたが、広島市内からのアクセスもよく、素敵な場所ばかりで本当に驚きました！ こうゆう場所にグランピング施設があれば観光客も訪れやすいですし、新たな雇用が生まれて地域活性化に繋がるのになぜ放置されているのか？？ なにより海に沈む夕陽を背景に、グランピングできたら最高ですよね〜！ 想像しただけでワクワクします！"]]}, {"n": "街中グランピング（広島市街地）", "y": "2017", "d": "2017年1月26日(投稿日)", "p": "広島市街の中心地の公園", "t": "街の中心地で正式な許可を取得したうえでグランピングを実施。本人いわく広島で街中グランピングをするのは自分たちだけ。", "ev": "根拠の投稿:2017-01-26", "im": [], "po": []}, {"n": "宮浜温泉×グランピング×夜桜（お花見グランピング）", "y": "2017", "d": "2017年4月1〜2日、4月8〜9日 17:00〜21:00", "p": "宮浜温泉(広島県廿日市市)/石亭の庭", "t": "宮浜温泉組合の協力で開催。石亭の庭を借りた野外抹茶席は1日限定40組・1人1,000円。懐石弁当プラン、温泉入浴券付、夜桜JAZZライブ(大人2000円/中高生1000円/小学生500円)を併催。", "ev": "根拠の投稿:2017-03-05、2017-03-07、2017-03-14、2017-04-02、2017-04-08", "im": ["ev/369.jpg", "ev/370.jpg"], "po": []}, {"n": "大野みんなのまつり「子供商店街」", "y": "2016–2019", "d": "2016年06月〜2019年06月(2件の記録)", "p": "廿日市市大野地域", "t": "37年続く地域の祭り。商工会⻘年部参加当初から「子供商店街」(子供達が経営を学び、子供達の裁量で運営する企画)を担当。今年から従来の小売形態を体験を売るワークショップ形式に変更し、開店から終了まで多数の子供・大人が参加。", "ev": "根拠の投稿:2016-06-12、2019-06-09", "im": ["ev/502.jpg", "ev/503.jpg", "ev/504.jpg"], "po": []}, {"n": "西の森フェスタ2019", "y": "2017–2019", "d": "2017年03月〜2019年04月(8件の記録)", "p": "⻄の森(広島)", "t": "実行委員として参加。廃材の森で作った「廃材モニュメント」を使い、古着の端切れを使うワークショップを実施。無料参加で300名様限定プレゼント付き。会場では廃材モニュメントを2つ探して撮影しSNS投稿するフォトコンテストを企画、先着300名にプレゼント、後日抽選で3名に賞品。大道芸・カレー・什器市・古着販売も。", "ev": "根拠の投稿:2017-03-15、2017-04-21、2017-04-22、2017-04-23、2017-04-24、2018-04-23、2019-04-06、2019-04-21", "im": ["ev/525.jpg", "ev/526.jpg", "ev/527.jpg"], "po": [["2018-04-23", "今日は宮島口の愉快なメンバーと海上にて新たなツアーリズムについて悪巧みw 宮島の鳥居をシージャック的に鑑賞できるツアーはインパクト抜群♪ 今後の展開が楽しみ。。。"]]}, {"n": "Mono/Coto market（モノコトマーケット）", "y": "2018–2019", "d": "2018年07月〜2019年05月(9件の記録)", "p": "国営備北丘陵公園(庄原市)", "t": "昨年に続く開催で今年はGW中10日間ぶっ通し。日替わりでワークショップ、アウトドアグッズ販売、アウトドアゲーム(ボーリング、ガンシューティング、ビーンバッグトス、ボールスクープ)を実施。物販出店は締切、WS出店は募集。5/1は駐車場・入園料無料、5/3は子供達と大ジャンケン大会。", "ev": "根拠の投稿:2018-07-31、2018-10-09、2019-04-16、2019-04-17、2019-04-20、2019-04-27、2019-05-01、2019-05-03、2019-05-06", "im": ["ev/600.jpg", "ev/601.jpg", "ev/602.jpg"], "po": []}, {"n": "岩倉グランピングフェス", "y": "2019–2020", "d": "2019年08月〜2020年10月(22件の記録)", "p": "岩倉ファームパークキャンプ場(廿日市市津田)", "t": "8月のSNSの一言から企画がスタートし約2ヶ月弱で開催。3年前の廿日市グランピングイベント以来の再挑戦で、コピーは「紅葉より赤く、燃えたぎる。」。のべ100人以上の有志が準備に協力し、8日間かけて設営(10/14のウッドデッキづくりは18名の協力で3年前の丸2日が約4時間に短縮)。協賛企業を募集(3万円/1万円/5千円のメニュー)。昼の部はグランピングテント体験・燻製・薪割り・ピザ・足場板のキッズチェア/キャンプラックづくり・⻘空マルシェ等、夜の部はアウトドアパーティー、アウトドアライブ、星空マルシェ、テントイルミネーション。終了後は12月中旬まで期間限定でテントレンタルを実験的に開始。", "ev": "根拠の投稿:2019-08-09、2019-09-08、2019-09-09、2019-09-19、2019-09-27、2019-09-28、2019-09-30、2019-10-02、2019-10-04、2019-10-06、2019-10-07、2019-10-09 ほか10件", "im": ["ev/677.jpg", "ev/678.jpg", "ev/679.jpg"], "po": []}, {"n": "ONEDAY MARKET", "y": "2015–2023", "d": "2015年05月〜2023年01月(6件の記録)", "p": "広島市⻄区・アルパーク近く、WOODPRO横", "t": "毎回WEBRO WORKSのデザインでポスターを制作・印刷。6月回は飲食店が充実、人気の焼き立てシフォンケーキを大量入荷。", "ev": "根拠の投稿:2015-05-23、2015-05-24、2015-05-25、2015-06-16、2015-06-28、2023-01-03", "im": ["ev/817.jpg", "ev/818.jpg", "ev/819.jpg"], "po": []}, {"n": "ポートマルシェ（Port marche）", "y": "2015–2016", "d": "2015年07月〜2016年04月(21件の記録)", "p": "広島市中区 十日市町周辺(ポートインク会場)", "t": "広島のモノづくり・ショップ運営者を支援し開催地に賑わいを生む目的で企画。ひろしま創業サポートセンターと連携し販路開拓を支援。テーブルブースは2月分まで予約が埋まり、会場で出店説明会も実施。", "ev": "根拠の投稿:2015-07-07、2015-07-25、2015-07-30、2015-08-08、2015-08-11、2015-08-28、2015-09-12、2015-09-16、2015-09-28、2015-10-03、2015-10-04、2015-10-06 ほか9件", "im": ["ev/820.jpg", "ev/821.jpg", "ev/496.jpg"], "po": []}, {"n": "ポートマルシェ 出店者サポート／創業支援の場づくり", "y": "2015", "d": "2015年8月28日に募集開始告知、10月4日開催回から", "p": "広島市 十日市町(ポートマルシェ会場)", "t": "物販だけでなく、経営者を支援する専門家と創業支援センターのスタッフを出店者につなぎ、新規顧客獲得・販路開拓を支援する仕組みを併設した。", "ev": "根拠の投稿:2015-08-28、2015-10-04", "im": ["ev/820.jpg", "ev/821.jpg", "ev/824.jpg"], "po": []}, {"n": "宮島口マルシェ", "y": "2016", "d": "2016年3月20〜21日の実験開催を経て3月末に本格スタート、以後毎週末(10月まで投稿を確認)", "p": "廿日市市 宮島口駅前「三女神」", "t": "3月20日に1組で実験出店し「ポートマルシェではこんなに売れない」ほどの売上、21日は2組。5月3日にホームページを自作、6月からWOODPROの屋台を常設、7月28日に初の出店者交流会(10時〜13時)を開催。", "ev": "根拠の投稿:2016-03-20、2016-03-28、2016-04-08、2016-04-10、2016-04-11、2016-05-03、2016-05-04、2016-05-05、2016-05-20、2016-05-26、2016-06-23、2016-07-08 ほか7件", "im": ["ev/825.jpg", "ev/826.jpg", "ev/827.jpg"], "po": []}, {"n": "大野地域 新春懇談会（大野町商工会青年部主催）", "y": "2019–2020", "d": "2019年01月〜2020年01月(2件の記録)", "p": "廿日市市大野地域", "t": "毎年恒例の新春懇談会に参加。令和2年は廿日市市に様々な変化がある年になるとして地域への協力を呼びかけた。", "ev": "根拠の投稿:2019-01-09、2020-01-07", "im": ["ev/108.jpg", "ev/109.jpg", "ev/110.jpg"], "po": []}, {"n": "HIROSHIMA学生応援PROJECT", "y": "2020–2021", "d": "2020年09月〜2021年08月(12件の記録)", "p": "レインボー倉庫広島", "t": "LINE公式アカウント登録でドリンク毎日1杯無料・フード半額・WiFiと勉強スペース無料。企業ミーティングを定期開催し学生と企業をつなぐ。10月21日時点で登録者はまもなく100名、広島経済レポートが取材。", "ev": "根拠の投稿:2020-09-09、2020-09-12、2020-09-23、2020-09-24、2020-10-09、2020-10-21、2020-11-28、2020-12-08、2020-12-19、2021-01-08、2021-01-14、2021-08-19", "im": ["ev/1024.jpg", "ev/1025.jpg", "ev/1026.jpg"], "po": [["2021-01-08", "今日はこちらに参加します💁‍♂️ 年明けから雪やコロナでバッタバタな今日この頃ですが、こんな時代だからこそ「繋がり」が大事になると思います。 激動が予想される2021年。 繋がりの力で乗り切りましょう！！"]]}, {"n": "学生応援プロジェクト（飲食版・美容版）", "y": "2021–2022", "d": "2021年11月〜2022年03月(3件の記録)", "p": "広島(協力店舗、広島市の一丸プロジェクト関連)", "t": "総額600万円を上限に予算確保し協力店舗の対象メニューを最大50%OFF。当初約1ヶ月→3/21まで延⻑。フタバ図書中筋店に特集コーナー設置", "ev": "根拠の投稿:2021-11-01、2022-01-17、2022-03-05", "im": ["ev/1064.jpg", "ev/1065.jpg", "ev/1066.jpg"], "po": [["2022-03-05", "すごい素敵な取組みだな〜と思って中国地方を検索してみたら1団体しかヒットしないという悲しみ、、、 存在に気づいてもらえるように僕もまだまだ頑張らねば😅"]]}, {"n": "廿日市市前副市長との懇談・東京と広島を結ぶ新規事業の打ち合わせ", "y": "2015", "d": "2015年8月24日", "p": "廿日市市", "t": "⺠間と行政が協力しあえる体制の重要性を語る姿に感銘を受け、今後微力ながら協力したいと記す。同日、小中学校給食無料化の話題にも触れる。", "ev": "根拠の投稿:2015-08-24", "im": [], "po": []}];
/* 年 → 道の位置（単位）。章の板の位置に合わせてある */
var YX = [[2011.5,200],[2013.7,300],[2015,400],[2016,520],[2017.5,650],[2018.5,760],[2020,860],[2021,910],[2024,1060],[2026,1150]];
function yearX(y){
 for(var i=1;i<YX.length;i++){ if(y <= YX[i][0]){ var a = YX[i-1], b = YX[i]; return a[1] + (b[1]-a[1]) * (y - a[0]) / (b[0]-a[0]); } }
 return YX[YX.length-1][1];
}
/* 標識を #cards に足す。年順に並べ、前の標識から22単位は離す。2列に互い違いで、章の板の反対側に立てる。
   写真があれば額に入れ、押すとその企画の写真と説明が窓に出る */
(function signs(){
 var wrap = document.getElementById('cards'); if(!wrap) return;
 var st = [].slice.call(wrap.querySelectorAll('.card:not(.sign)')).map(function(el){ return {x:+el.dataset.x, side:el.dataset.side}; });
 function oppositeOf(x){
  var best = null, d = 1e9;
  for(var k=0;k<st.length;k++){ var dd = Math.abs(st[k].x - x); if(dd < d){ d = dd; best = st[k]; } }
  return (best && best.side === 'l') ? 'r' : 'l';
 }
 function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
 function asset(q){ return (window.PREVIEW_ASSETS && window.PREVIEW_ASSETS[q]) || q; }
 /* 企画一覧PDFの全364件（data-ev.js）。年ごとにまとめて、年の標識から一覧の窓を開く */
 var ALL = window.EVALL || [], CATS = window.EVCATS || [], byY = {};
 function imgs(e){ return (e.im || []).map(function(v){ return typeof v === 'number' ? 'ev/' + v + '.jpg' : v; }); }
 /* 一覧では72pxで出すので、原寸(420px)ではなく縮小版を読む */
 function thumb(src){ return src.indexOf('ev/') === 0 ? src.replace('ev/', 'ev/t/') : src; }
 for(var a=0;a<ALL.length;a++){ (byY[ALL[a].y] = byY[ALL[a].y] || []).push(a); }
 /* 窓に出す中身（標識と、年の一覧から開いた企画で共通） */
 function popOf(e, extra){
  var pop = '<p class="pop-meta">' + esc(e.y) + (e.d ? '　' + esc(e.d) : '') + (e.p ? '<br>' + esc(e.p) : '') + '</p>';
  if(e.t) pop += '<p class="pop-t">' + esc(e.t) + '</p>';
  var im = imgs(e);
  if(im.length){ pop += '<div class="pop-ph">'; for(var q=0;q<im.length;q++) pop += '<img src="' + asset(im[q]) + '" alt="' + esc(e.n) + 'の写真 ' + (q+1) + '枚目">'; pop += '</div>'; }
  else pop += '<p class="pop-none">この企画の写真は、投稿に残っていません。</p>';
  if(e.po && e.po.length){
   for(var r=0;r<e.po.length;r++){
    var pd = e.po[r][0].split('-');
    pop += '<div class="pop-fb"><div class="pop-fbh"><b>ヤスムラ ミチヨシ</b><time>' + (+pd[0]) + '年' + (+pd[1]) + '月' + (+pd[2]) + '日</time><span>当時の投稿</span></div><p>' + esc(e.po[r][1]) + '</p></div>';
   }
  }
  if(e.ev) pop += '<p class="pop-ev">根拠の投稿：' + esc(e.ev) + '</p>';
  pop += extra || '';
  pop += '<p class="pop-src">出典：企画一覧PDF（13年の記録 詳細レポート）。写真は当時Facebookに公開したもの。</p>';
  return pop;
 }
 function yearBtn(y){ var n = (byY[y] || []).length; return n ? '<p class="btns"><button type="button" class="btn" data-year="' + y + '">' + y + '年にやったこと ' + n + '件を見る</button></p>' : ''; }
 var ev = EVENTS.slice().sort(function(a,b){ return parseInt(a.y,10) - parseInt(b.y,10); });
 var last = -1e9, i, e, placed = [];
 for(i=0;i<ev.length;i++){
  e = ev[i]; var year = parseInt(e.y, 10);
  var x = Math.max(Math.round(yearX(year) - 8), last + 22); last = x; placed.push(x);
  var side = oppositeOf(x), zz = 40 + 12 * (i % 2);
  var el = document.createElement('div');
  el.className = 'card sign' + (e.im && e.im.length ? ' has-photo' : ''); el.dataset.x = x; el.dataset.side = side; el.dataset.z = side === 'r' ? -zz : zz;
  var h = '<div class="in">';
  if(e.im && e.im.length) h += '<img data-src="' + asset(e.im[0]) + '" alt="' + esc(e.n) + 'の写真">';
  h += '<span class="yr">' + esc(e.y) + '</span><b class="nm">' + esc(e.n) + '</b>';
  if(e.d) h += '<small class="meta">' + esc(e.d) + (e.p ? '<br>' + esc(e.p) : '') + '</small>';
  h += '</div>';
  el.innerHTML = h;
  el.setAttribute('data-pop', popOf(e, yearBtn(year))); el.setAttribute('data-pop-title', e.n); el.setAttribute('role','button'); el.tabIndex = 0;
  wrap.appendChild(el);
 }
 /* 年の道標。標識の列より外側（z=±76）に小さく立てる。engine の置き方（画面 x=(x-z)*8, y=(x+z)*4、板は側に寄せて縦は中央）で
    画面上の枠を出し、標識と重ならない位置まで年の位置から前後にずらす */
 function rectOf(x, z, side, w, h){ var sx = (x - z) * 8, sy = (x + z) * 4; return [side === 'r' ? sx : side === 'l' ? sx - w : sx - w/2, sy - h/2, w, h]; }
 function hit(a, b, m){ return a[0] < b[0] + b[2] + m && b[0] < a[0] + a[2] + m && a[1] < b[1] + b[3] + m && b[1] < a[1] + a[3] + m; }
 var rects = [].slice.call(wrap.querySelectorAll('.card.sign')).map(function(el){ return rectOf(+el.dataset.x, +el.dataset.z, el.dataset.side, el.offsetWidth, el.offsetHeight); });
 var years = Object.keys(byY).map(Number).sort();
 for(i=0;i<years.length;i++){
  var yy = years[i], x0 = Math.round(yearX(yy)) - 8, me = document.createElement('div');
  me.className = 'card sign year';
  me.innerHTML = '<div class="in"><span class="yr">' + yy + '</span><b class="nm">' + byY[yy].length + '件 ▶</b><small class="meta">この年にやったこと</small></div>';
  me.setAttribute('data-year', yy); me.setAttribute('role','button'); me.tabIndex = 0; me.setAttribute('aria-label', yy + '年にやったこと ' + byY[yy].length + '件');
  wrap.appendChild(me);
  var mw = me.offsetWidth || 112, mh = me.offsetHeight || 86, xy = x0, sd = oppositeOf(x0), best = null;
  for(var d=0; d<=60 && best === null; d+=2){
   var cand = d ? [x0 + d, x0 - d] : [x0];
   for(var c=0;c<cand.length;c++){
    var cs = oppositeOf(cand[c]), r = rectOf(cand[c], cs === 'r' ? -76 : 76, cs, mw, mh), clash = false;
    for(var k=0;k<rects.length;k++){ if(hit(r, rects[k], 8)){ clash = true; break; } }
    if(!clash){ best = r; xy = cand[c]; sd = cs; break; }
   }
  }
  me.dataset.x = xy; me.dataset.side = sd; me.dataset.z = sd === 'r' ? -76 : 76;
  rects.push(best || rectOf(xy, sd === 'r' ? -76 : 76, sd, mw, mh));
 }
 /* 年の一覧の窓。分類ごとに並べ、押すとその企画の写真と説明に切り替わる */
 function openYear(y){
  var list = byY[y] || [], h = '<p class="pop-meta">' + y + '年　' + list.length + '件</p>';
  for(var c=1;c<=8;c++){
   var ks = list.filter(function(k){ return ALL[k].c === c; }); if(!ks.length) continue;
   h += '<h4 class="pop-cat">' + esc(CATS[c-1] || '') + '　' + ks.length + '件</h4><ul class="evl">';
   ks.forEach(function(k){
    var e = ALL[k], im = imgs(e);
    h += '<li data-ei="' + k + '" role="button" tabindex="0">' + (im.length ? '<img src="' + asset(thumb(im[0])) + '" loading="lazy" alt="' + esc(e.n) + 'の写真">' : '<span class="evi-no"></span>') + '<span><b>' + esc(e.n) + '</b><small>' + esc(e.d) + (e.p ? '<br>' + esc(e.p) : '') + '</small></span></li>';
   });
   h += '</ul>';
  }
  h += '<p class="pop-src">出典：企画一覧PDF（13年の記録 詳細レポート）。押すと、その企画の写真と説明が出ます。</p>';
  window.Road.openHtml(y + '年にやったこと', h);
 }
 function openEvent(k){
  var e = ALL[k]; if(!e) return;
  window.Road.openHtml(e.n, '<p class="btns"><button type="button" class="btn" data-year="' + e.y + '">◀ ' + e.y + '年の一覧に戻る</button></p>' + popOf(e, ''));
 }
 function canWin(){ return !!(window.Road && window.Road.openHtml); }   /* WebGLが無い端末では窓が組まれない */
 function act(t){
  if(!canWin()) return false;
  var b = t.closest('[data-year]'); if(b){ openYear(+b.getAttribute('data-year')); return true; }
  var li = t.closest('[data-ei]'); if(li){ openEvent(+li.getAttribute('data-ei')); return true; }
  return false;
 }
 document.addEventListener('click', function(ev){ if(act(ev.target)) ev.preventDefault(); });
 document.addEventListener('keydown', function(ev){ if(ev.key === 'Enter' && (ev.target.matches('[data-year],[data-ei]'))){ if(act(ev.target)) ev.preventDefault(); } });
})();

var PHOTOS = [{"ch": 0, "src": "img/001-c45656f9.jpg", "cap": "一年ぶりの動物園。久しぶりのキリンに、子供たちがびびっていた"}, {"ch": 0, "src": "img/005-2d00680a.jpg", "cap": "宮島の水族館。この日の投稿を最後に、記録が20か月止まる"}, {"ch": 0, "src": "img/007-421b837c.jpg", "cap": "宮島町。この日はプラレールからの宮島だった"}, {"ch": 1, "src": "img/038-7c30a223.jpg", "cap": "家族と。"}, {"ch": 2, "src": "img/040-a32daad8.jpg", "cap": "アルパークのすぐ近く、WOODPROさんの横。使われていない施設の一角が、市場になりました。"}, {"ch": 2, "src": "img/044-5a91ad4e.jpg", "cap": "出店者と、来てくれた人。"}, {"ch": 2, "src": "img/050-2c1a5da6.jpg", "cap": "まず一枚のチラシから。作り手が集まる日を、自分で決めた。"}, {"ch": 2, "src": "wall/g0108-a1457003.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 3, "src": "img/116-c1b8771d.jpg", "cap": "設営スタートの日。会場の岩倉キャンプ場は、ほんとうに何もない原っぱだった。"}, {"ch": 3, "src": "img/120-50eb62da.jpg", "cap": "WOODPROの足場板でランウェイを通し、キャンドルを並べた。"}, {"ch": 3, "src": "img/122-fc9c50ea.jpg", "cap": "2016年8月27日、本番の夜。原っぱが、この姿になった。"}, {"ch": 3, "src": "wall/g0112-f63a72f3.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 4, "src": "img/295-49d8cde9.jpg", "cap": "材はここから来る。山を下りた木が、次の役目を待っている。"}, {"ch": 4, "src": "img/301-f1c6fd9c.jpg", "cap": "積まれていた板が、床になる。使い道は、こちらで決める。"}, {"ch": 4, "src": "img/303-c1de47ad.jpg", "cap": "一軒ずつ直すより早い方法。空き家の直し方を、人に渡す。"}, {"ch": 4, "src": "wall/g0124-720ad9ed.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 5, "src": "img/400-7178f3f0.jpg", "cap": "水を提げて、階段を上る。給水所へ行けない人の家まで、一軒ずつ。"}, {"ch": 5, "src": "img/402-e723ab37.jpg", "cap": "軽トラックに生活用水。毎日1000リットル近くを配った。"}, {"ch": 5, "src": "img/408-30f7e545.jpg", "cap": "配ったのは支援ではなく、ふつうに旨い一皿だった"}, {"ch": 5, "src": "wall/g0136-670493b9.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 6, "src": "img/607-46c62a0c.jpg", "cap": "制作の現場で見た一台。キッチンカーの概念を覆す作品ばかりだった"}, {"ch": 6, "src": "img/613-660810e7.jpg", "cap": "屋根からバスケットゴールが飛び出す一台。こういうものが並んでいた"}, {"ch": 6, "src": "img/605-48b1fd54.jpg", "cap": "屋根の下で一台ずつ組み上げる。ここが製造の現場。"}, {"ch": 6, "src": "wall/g0148-cc5a096b.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 7, "src": "img/749-5c329c1a.jpg", "cap": "僕です。まちの困りごとに、つくることで向き合っています。"}];
/* 章の停留所（埋め込みの章番号 → 道の位置と板の側） */
var STN = [[220,'l'],[330,'r'],[440,'l'],[560,'r'],[680,'l'],[800,'r'],[940,'l'],[1080,'r']];
/* 写真の看板の置き場。板の周りの画面上の3か所（左上・真上・右）を決めて、道の座標に逆算する。
   画面 dx = (x - z)*8, dy = (x + z)*4 なので x = (dx/8 + dy/4)/2, z = (dy/4 - dx/8)/2 */
var SCR = [[-400,-380],[40,-520],[720,-120]];
var POSTS = [];   /* 街に立てる支柱の位置 */
(function posters(){
 var wrap = document.getElementById('cards'); if(!wrap) return;
 function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
 var byCh = {}, i;
 for(i=0;i<PHOTOS.length;i++){ (byCh[PHOTOS[i].ch] = byCh[PHOTOS[i].ch] || []).push(PHOTOS[i]); }
 for(var ch in byCh){
  var list = byCh[ch], st = STN[+ch], g = null, ms = [];
  for(i=0;i<list.length;i++){ if(list[i].g) g = list[i]; else ms.push(list[i]); }
  var pick = [ms[0], ms[1], g || ms[2]];
  for(i=0;i<3;i++){
   var ph = pick[i]; if(!ph) continue;
   var dx = SCR[i][0] * (st[1] === 'l' ? -1 : 1), dy = SCR[i][1] + 190;
   var x = st[0] + Math.round((dx/8 + dy/4)/2), z = (st[1] === 'r' ? -16 : 16) + Math.round((dy/4 - dx/8)/2);
   z = Math.max(-60, Math.min(60, z));
   var el = document.createElement('figure');
   el.className = 'card photo' + (ph.g ? ' group' : ''); el.dataset.x = x; el.dataset.z = z; el.dataset.side = 'p'; el.dataset.ch = ch;
   el.innerHTML = '<div class="in"><img data-src="' + ph.src + '" alt="' + esc(ph.cap) + '"><figcaption>' + ph.cap + '</figcaption></div>';
   el.addEventListener('click', function(e){ var b = document.querySelector('a[data-win="story.html?ch=' + (+this.dataset.ch + 1) + '"]'); if(b){ e.preventDefault(); b.click(); } });
   wrap.appendChild(el);
   POSTS.push([x, z]);
  }
 }
})();


/* ===== 顔ウォール・集合写真・おまけ・呼びかけ（/life/ の機能をこの道に移したもの） ===== */
(function extras(){
 var wrap = document.getElementById('cards'); if(!wrap) return;
 function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
 /* 章の板 → 顔ウォールの板の置き場（板の40単位先、反対側） */
 var FW = {'はじまり':[220,'l'],'第一章':[440,'l'],'第二章':[560,'r'],'第三章':[680,'l'],'第四章':[800,'r'],'第五章':[940,'l'],'結び':[1080,'r']};
 var cards = {};
 for(var k in FW){
  var st = FW[k], el = document.createElement('div');
  el.className = 'card aux faces'; el.dataset.x = st[0] + 40; el.dataset.side = st[1] === 'l' ? 'r' : 'l'; el.dataset.z = st[1] === 'l' ? -24 : 24; el.dataset.fw = k; el.hidden = true;
  el.innerHTML = '<div class="in"><span class="kick">この中に、あなたがいるかもしれません</span><b class="fw-n"></b>'
   + '<p class="lead">この13年を一緒に過ごしてくれた人たちです。顔を押すと、その人が写っている写真が出てきます。この章の期間に撮った写真から、顔を集めました。</p>'
   + '<div class="facegrid"></div><p class="btns"><button type="button" class="btn" data-group hidden></button></p></div>';
  wrap.appendChild(el); cards[k] = el;
 }
 function asset(q){ return (window.PREVIEW_ASSETS && window.PREVIEW_ASSETS[q]) || q; }   /* プレビュー用に画像を差し替える口 */
 function gal(ids, title){
  if(!window.Road || !window.Road.openHtml) return;
  var h = '<div class="pop-big" hidden><img alt="拡大した写真"></div><div class="pop-gal">';
  for(var i=0;i<ids.length;i++) h += '<img src="' + asset('wall/t' + ids[i] + '.jpg') + '" data-full="' + asset('wall/g' + ids[i] + '.jpg') + '" alt="当時の写真 ' + (i+1) + '枚目" loading="lazy">';
  h += '</div><p class="pop-src">写真は当時Facebookに公開したもの。押すと大きくなります。</p>';
  window.Road.openHtml(title, h);
  var box = document.querySelector('#win-html .pop-gal'), big = document.querySelector('#win-html .pop-big');
  if(box) box.addEventListener('click', function(e){ var im = e.target.closest('img'); if(!im) return; big.hidden = false; big.querySelector('img').src = im.getAttribute('data-full'); document.getElementById('win-html').scrollTop = 0; });
 }
 function fill(W){
  var chs = W.chapters || [], people = W.people || [], any = false;
  for(var k in cards){
   var el = cards[k], ch = null;
   for(var q=0;q<chs.length;q++){ if(chs[q].k === k){ ch = chs[q]; break; } }
   if(!ch || !ch.t || !ch.t.length){ el.parentNode.removeChild(el); delete cards[k]; continue; }
   el.hidden = false; any = true;
   el.querySelector('.fw-n').textContent = '　' + ch.t.length + '人';
   var grid = el.querySelector('.facegrid'); grid.style.setProperty('--wg', W.grid || 12);
   ch.t.forEach(function(pi){
    var pe = people[pi]; if(!pe) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ft wt-' + pi;
    b.setAttribute('aria-label', (pe.y ? pe.y + '　' : '') + pe.n + '枚の写真に写っている人');
    b.addEventListener('click', function(){
     var yy = pe.y ? pe.y.split('-') : null, yl = yy ? (yy[0] === yy[1] ? yy[0] : yy[0] + '〜' + yy[1]) + '年' : '';
     gal(pe.p, 'この人が写っている写真　' + pe.n + '枚' + (yl ? '（' + yl + '）' : ''));
    });
    grid.appendChild(b);
   });
   var gb = el.querySelector('[data-group]');
   if(ch.g && ch.g.length){
    gb.hidden = false; gb.textContent = 'この時期の集合写真　' + ch.g.length + '枚';
    (function(ids){ gb.addEventListener('click', function(){ gal(ids, 'この時期の集合写真　' + ids.length + '枚。誰が写っているかは書いていません。探してみてください。'); }); })(ch.g);
   }
  }
  if(window.Road) window.Road.relayout();
 }
 /* 顔の板は入口では要らない。顔の画像は329KBあるので、道に入ってから読む。
    ただしWebGLが使えない端末では道に入る合図が来ないので、そのときは読み込みまで待って出す */
 var wallStarted = false;
 function loadWall(){
  if(wallStarted) return; wallStarted = true;
  if(window.WALL_DATA){ setTimeout(function(){ fill(window.WALL_DATA); }, 0); return; }
  try{ fetch('wall.json', {cache:'no-store'}).then(function(r){ return r.json(); }).then(fill).catch(function(){ for(var k in cards) cards[k].parentNode.removeChild(cards[k]); if(window.Road) window.Road.relayout(); }); }catch(e){}
 }
 addEventListener('road:enter', loadWall, {once:true});
 addEventListener('load', function(){ if(document.documentElement.classList.contains('nogl')) loadWall(); });

 /* おまけ: 13年から1枚引く／きょうと同じ日付 */
 function fbcard(p, label){
  return '<div class="pop-fb"><div class="pop-fbh"><b>ヤスムラ ミチヨシ</b><time>' + p[0] + '年' + p[1] + '月' + p[2] + '日</time><span>' + label + '</span></div><p>' + esc(p[3]) + '</p></div>';
 }
 var db = document.getElementById('drawbtn'), tb = document.getElementById('tdbtn');
 if(db) db.addEventListener('click', function(){
  var RP = window.RP || []; if(!RP.length || !window.Road || !window.Road.openHtml) return;
  var p = RP[Math.floor(Math.random()*RP.length)];
  window.Road.openHtml('13年から無作為に1枚', fbcard(p, '当時の投稿') + '<p class="btns"><button type="button" class="btn" id="draw-again">もう1枚引く</button></p>');
  var again = document.getElementById('draw-again'); if(again) again.addEventListener('click', function(){ db.click(); });
 });
 if(tb) tb.addEventListener('click', function(){
  if(!window.Road || !window.Road.openHtml) return;
  var RP = window.RP || [], DC = window.DAYCNT || {}, n = new Date(), m = n.getMonth()+1, d = n.getDate();
  var key = ('0'+m).slice(-2) + ('0'+d).slice(-2), cnt = DC[key] || '00000000000000', cells = '';
  for(var i=0;i<14;i++){ var y = 2011+i; if(y===2011 && m<7) continue; if(y===2024 && m>1) continue; var c = +cnt.charAt(i); cells += '<li class="' + (c ? 'on' : '') + '"><b>' + y + '</b>' + (c ? c + '件' : '—') + '</li>'; }
  var exact = RP.filter(function(q){ return q[1]===m && q[2]===d; }), pick = null, note = '';
  if(exact.length){ pick = exact[Math.floor(Math.random()*exact.length)]; note = 'きょうと同じ日付に書いたものです。'; }
  else { var best = null, bd = 1e9; RP.forEach(function(q){ var A = new Date(2001,m-1,d), B = new Date(2001,q[1]-1,q[2]); var diff = Math.abs(A-B)/86400000; diff = Math.min(diff, 365-diff); if(diff<bd){ bd = diff; best = q; } }); pick = best; if(pick) note = m + '月' + d + '日ちょうどの記録は、ここに入れている分にはありませんでした。いちばん近い' + pick[1] + '月' + pick[2] + '日を出します。'; }
  var h = '<p class="pop-t">きょうは' + m + '月' + d + '日。13年分の' + m + '月' + d + '日は、こうでした。</p><ul class="daystrip">' + cells + '</ul><p class="pop-src">数えているのは1,992件ぜんぶです。</p>';
  if(pick) h += '<p class="pop-meta">' + esc(note) + '</p>' + fbcard(pick, 'その日の記録');
  window.Road.openHtml('きょうと同じ日付の僕', h);
 });

 /* 呼びかけ先。既定はメッセージ。cta.json に投稿URLを入れると、リンクも文言もコメント欄向けに変わる */
 var CTAW = {'ひとこと送る':'コメントする','メッセージで':'コメントに','メッセージで一行だけ':'コメントに一行だけ'};
 try{ fetch('cta.json', {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(c){
  if(!c || !c.url) return;
  var a = document.getElementById('ctalink'); if(a) a.href = c.url;
  var p = document.getElementById('pill'); if(p) p.href = c.url;
  [].forEach.call(document.querySelectorAll('.cta-w'), function(el){ var t = CTAW[el.textContent.trim()]; if(t) el.textContent = t; });
 }).catch(function(){}); }catch(e){}
})();

/* 章の本文。枠（iframe）は拡張機能に止められることがあるので、
   切り出しておいた本文（chapters.*.js）を必要になってから読んで、窓に直接入れる */
var chapState = 0, chapWaiting = [];   /* 0=まだ 1=読み込み中 2=読めた 3=だめだった */
function withChapters(cb){
 if(chapState === 2) return cb(true);
 if(chapState === 3) return cb(false);
 chapWaiting.push(cb);
 if(chapState === 1) return;
 chapState = 1;
 function finish(ok){ chapState = ok ? 2 : 3; var w = chapWaiting.splice(0); for(var i=0;i<w.length;i++) w[i](ok); }
 var m = document.querySelector('meta[name="chapters-src"]');
 if(!m || !m.content) return finish(false);
 var sc = document.createElement('script');
 sc.src = m.content;
 sc.onload = function(){
  if(!window.CHAPTERS) return finish(false);
  if(!window.CHAPTERS_CSS) return finish(true);
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = window.CHAPTERS_CSS;
  l.onload = function(){ finish(true); };
  l.onerror = function(){ finish(true); };   /* 見た目が来なくても本文は読める */
  document.head.appendChild(l);
 };
 sc.onerror = function(){ finish(false); };
 document.head.appendChild(sc);
}

/* 終わりの「これから」の区間＝並木通り（広島市中区）。物は ../road/namiki-kit.js から */
var NKX = 1288, NK0 = 1320, NK1 = 1712;   // わたる道の始まり／並木通りの始まり・終わり

window.ROAD_SCENE = {
 L: 1800,
 autoTo: 1300,        // 既定の飾り（街灯・ベンチ・奥の木・歩く人）はここまで。この先は並木通りとして組む
 hero: null,
 /* 窓に出す章の本文を engine に渡す。url は "story.html?ch=3" のような形 */
 chapterHtml: function(url, cb){
  var k = String(url).split('ch=')[1]; k = k ? k.split('&')[0] : '';
  withChapters(function(ok){
   var c = ok && window.CHAPTERS ? window.CHAPTERS[k] : null;
   cb(c ? c[1] : null);
  });
 },
 /* 空白の章（2013.9〜2015.4）の地面だけ色が抜ける。
    終わりの「これから」の区間は、並木通りの路面になる */
 tile: function(tx, tz, c){
  if(tx >= 37 && tx <= 48 && Math.abs(tz) >= 2) return ((tx+tz)&1) ? '#CBD2C3' : '#BFC7B7';
  var x = tx * 8;
  if(x < NKX || x >= NK1) return null;
  var P = window.NAMIKI && window.NAMIKI.P; if(!P) return null;
  var chk = (tx + tz) & 1;
  var road = (tz === -1 || tz === 0), walk = (tz === -2 || tz === 1);
  var lot = (tz === -4 || tz === -3 || tz === 2 || tz === 3);
  var back = (tz === -6 || tz === -5 || tz === 4 || tz === 5);
  if(x < NK0) return road ? P.road : ((walk || lot) ? P.cross : (back ? (chk ? P.back1 : P.back2) : null));   // わたる道
  if(back) return chk ? P.back1 : P.back2;
  if(walk || tz === -3 || tz === 2) return chk ? P.brick1 : P.brick2;    // レンガに変わった歩道
  if(lot) return chk ? P.lot1 : P.lot2;
  return null;                                                          // 車道はアスファルトのまま
 },
 /* わたる道では白線を引かず、並木通りでは車道を少し絞る */
 mark: function(tx){
  var x = tx * 8;
  if(x >= NKX && x < NK0) return 'none';
  if(x >= NK0 && x < NK1) return 7;
  return null;
 },
 build: function(api){
  var M = api.M, C = api.C, Model = api.Model, put = api.put, movers = api.movers, anim = api.anim, drift = api.drift, smoke = api.smoke, L = api.L, SEA_Y = api.SEA_Y;

  /* この道だけの物 */
  M.child = function(shirt, pants){
   var m = new Model();
   m.box(-1,0,-1,1,1,1,pants).box(0,0,-1,1,1,1,pants);
   m.box(-1,1,-1,2,2,2,shirt); m.box(-1,3,-1,2,2,2,C.skin); m.box(-1,5,-1,2,1,2,C.hair);
   return m;
  };
  M.giraffe = function(){
   var m = new Model(), y = C.yellow, b = C.brown;
   m.box(-4,0,-2,1,4,1,y).box(3,0,-2,1,4,1,y).box(-4,0,1,1,4,1,y).box(3,0,1,1,4,1,y);
   m.box(-4,4,-2,8,4,4,y);
   m.box(3,8,-1,2,6,2,y); m.box(3,14,-2,4,2,3,y); m.set(4,16,-1,b).set(6,16,-1,b);
   m.set(-2,5,1,b).set(1,6,1,b).set(-1,4,1,b).set(-3,7,-1,b).set(2,7,0,b).set(3,10,0,b).set(4,12,0,b);
   m.set(-5,6,0,b);
   return m;
  };
  M.well = function(){
   var m = new Model();
   m.box(-2,0,-2,4,2,4,C.gray); m.box(-1,1,-1,2,1,2,C.navy);
   m.box(-2,2,-2,1,5,1,C.brown).box(1,2,1,1,5,1,C.brown);
   m.box(-3,7,-3,6,1,6,C.roof); m.box(-2,8,-2,4,1,4,C.roof);
   return m;
  };
  M.tank = function(){ return new Model().box(-2,0,-2,4,4,4,C.blue).box(-1,4,-1,2,1,2,C.wht).set(1,2,1,C.glass); };
  M.office = function(){
   var m = new Model();
   m.box(-6,0,-5,12,14,10,'#B8C0CC');
   for(var f=0;f<4;f++){ var yy = 2+f*3; for(var i=0;i<5;i++){ m.box(-5+i*2, yy, 4, 1, 2, 1, C.glass); m.box(5, yy, -4+i*2, 1, 2, 1, C.glass); } }
   m.box(-1,0,4,2,3,1,C.ink); m.box(-6,14,-5,12,1,10,C.dgray); m.box(-1,15,-1,2,4,2,C.dgray);
   return m;
  };
  M.raincloud = function(){
   var m = new Model(), g = '#6B7A8C';
   m.box(-4,0,-1,8,2,3,g); m.box(-2,1,-2,5,2,5,g); m.box(1,0,0,5,2,2,g); m.box(-6,0,0,3,1,2,g);
   m.set(-3,-3,0,C.cyan).set(0,-2,1,C.cyan).set(3,-4,0,C.cyan).set(1,-5,-1,C.cyan).set(-1,-6,0,C.cyan);
   return m;
  };
  M.cake = function(){
   var m = new Model();
   m.box(-4,0,-4,8,1,8,C.wht); m.box(-3,1,-3,6,3,6,C.cream); m.box(-2,4,-2,4,2,4,C.pink);
   m.set(-1,6,-1,C.yellow).set(1,6,1,C.yellow).set(-1,7,-1,C.orange).set(1,7,1,C.orange);
   return m;
  };
  M.stage = function(){
   var m = new Model();
   m.box(-8,0,-4,16,2,8,C.wood); m.box(-8,2,-4,16,6,1,C.ink); m.box(-6,4,-4,4,2,1,C.lime).box(2,4,-4,4,2,1,C.cyan);
   m.box(-9,0,3,2,4,2,C.dgray).box(7,0,3,2,4,2,C.dgray);
   return m;
  };
  M.pallets = function(){
   var m = new Model();
   m.box(-4,0,-3,8,1,6,C.wood); m.box(-4,1,-3,8,1,6,C.brown); m.box(-3,2,-2,6,1,4,C.wood); m.box(-3,3,-2,6,1,4,C.brown);
   m.box(-2,4,-1,4,2,2,C.wood);
   return m;
  };
  var GL = {
   '1':['..#..','.##..','..#..','..#..','.###.'],
   '3':['####.','....#','.###.','....#','####.']
  };
  M.digit = function(ch, col){
   var m = new Model(), g = GL[ch];
   for(var r=0;r<g.length;r++) for(var c=0;c<g[r].length;c++) if(g[r][c]==='#') m.box(c*2-5, (g.length-1-r)*2, -1, 2, 2, 2, col);
   return m;
  };
  /* 写真の看板の支柱。板そのものは HTML で、この上に乗る */
  M.billboard = function(){
   var m = new Model();
   m.box(-13,0,0,2,10,1,C.brown).box(11,0,0,2,10,1,C.brown);
   m.box(-13,4,0,26,1,1,C.brown);
   m.box(-14,0,-1,4,1,3,C.dgray).box(10,0,-1,4,1,3,C.dgray);
   return m;
  };
  for(var pi=0; pi<POSTS.length; pi++) put(M.billboard(), POSTS[pi][0], POSTS[pi][1]);

  /* 出発点。海に鳥居、START */
  put(M.arch(C.lime), 60, 0);
  put(M.torii(), 4, -80, SEA_Y);
  put(M.sakura(), 40, 24); put(M.sakura(), 4, 30);
  put(M.house(C.cream, C.roof, 10, 8, 6), 8, 46); put(M.house(C.wht, C.slate, 12, 8, 6), 44, 44);
  put(M.person(C.blue, C.ink, null, 0), 30, 22); put(M.child(C.red, C.ink), 34, 22); put(M.child(C.yellow, C.ink), 37, 22);

  /* このページについて。13 の文字 */
  put(M.digit('1', C.ink), 132, 40); put(M.digit('3', C.lime), 148, 40);
  put(M.shop(C.wht, C.cyan, 12, 8, 6), 110, 46); put(M.bench(), 150, 20); put(M.tree(C.g3), 170, 30);

  /* はじまり。家と家族、動物園のキリン */
  put(M.house(C.cream, C.roof, 10, 8, 6), 200, -30); put(M.house(C.wht, C.slate, 10, 8, 7), 236, -46);
  put(M.person(C.blue, C.ink, null, 0), 214, -22); put(M.child(C.red, C.ink), 218, -22); put(M.child(C.yellow, C.brown), 221, -22);
  put(M.car(C.wht), 262, -24); put(M.giraffe(), 256, -44); put(M.tree(C.g3), 276, -32); put(M.bush(), 246, -30);

  /* 空白。色の抜けた地面に、ベンチと枯れ木と小さな店 */
  put(M.tree('#8A9A7B'), 330, 30); put(M.bench(), 352, 22); put(M.person(C.dgray, C.ink, null, 0), 354, 20);
  put(M.shop(C.cream, C.purple, 10, 8, 6), 376, 44);

  /* 再起動。マルシェと古材、のぼり */
  put(M.stall(C.red), 410, -28); put(M.stall(C.blue), 426, -32); put(M.stall(C.orange), 442, -28);
  put(M.pallets(), 470, -44); put(M.crate(), 478, -40); put(M.crate(), 474, -34);
  put(M.person(C.red, C.ink, null, 0), 414, -22); put(M.person(C.cyan, C.brown, null, 0), 430, -20); put(M.person(C.pink, C.ink, null, 0), 446, -22); put(M.person(C.lime, C.navy, C.yellow, 0), 452, -20);
  movers.push(anim([M.flagpole(0, C.orange), M.flagpole(1, C.orange)], 400, 0, -22, 3));
  movers.push(anim([M.flagpole(0, C.red), M.flagpole(1, C.red)], 458, 0, -24, 3));
  put(M.sign(C.red), 486, -20);

  /* 場をつくる。キャンプ場と、レインボー倉庫と、舞台 */
  put(M.tent(C.orange), 516, 30); put(M.tent(C.blue), 532, 44); put(M.lamp(), 524, 26);
  movers.push(anim([M.campfire(0), M.campfire(1)], 526, 0, 36, 6));
  put(M.pine(), 508, 48); put(M.pine(), 544, 56);
  put(M.warehouse(), 584, 46);
  put(M.stage(), 616, 28);
  put(M.person(C.yellow, C.ink, null, 0), 560, 22); put(M.person(C.purple, C.brown, null, 0), 566, 20); put(M.person(C.wht, C.navy, null, 0), 572, 22); put(M.person(C.red, C.ink, null, 0), 604, 22);

  /* 捨てられるものを、もう一度。廃材の森、空き家、会社 */
  put(M.pallets(), 640, -30); put(M.crate(), 648, -34); put(M.crate(), 652, -28); put(M.pallets(), 660, -40);
  put(M.house(C.cream, C.slate, 10, 8, 6), 684, -44); put(M.person(C.wht, C.ink, C.yellow, 0), 676, -24); put(M.person(C.lime, C.ink, C.brown, 0), 692, -22);
  put(M.sign(C.blue), 704, -20);
  put(M.shop(C.wht, C.lime, 12, 8, 6), 726, -42); put(M.tree(C.g3), 744, -30);

  /* 制度の外にいる人へ。雨雲、井戸、水、集会所のキッチンカーに並ぶ人、合同庁舎 */
  movers.push(drift([M.raincloud()], 760, 34, 26, 0.3, 740, 800));
  put(M.well(), 760, 30); put(M.tank(), 768, 22); put(M.tank(), 773, 22);
  put(M.kei(C.wood, C.red), 806, 30);
  for(var q=0;q<8;q++) put(q%3 ? M.person([C.red,C.blue,C.yellow,C.pink][q%4], C.ink, null, 0) : M.child([C.cyan,C.lime,C.orange][q%3], C.ink), 790 + q*3, 20);
  put(M.house(C.wht, C.slate, 12, 8, 6), 828, 46);
  put(M.office(), 866, 44); put(M.person(C.lime, C.ink, C.brown, 0), 858, 22); put(M.person(C.wht, C.navy, C.navy, 0), 864, 22);

  /* つくる側へ。初号機、カフェ、トレーラー、陸送 */
  put(M.kei(C.wood, C.red), 900, -24); put(M.foodtruck(C.orange), 924, -46);
  put(M.shop(C.cream, C.orange, 12, 8, 6), 946, -28); put(M.person(C.pink, C.ink, null, 0), 936, -20); put(M.person(C.cyan, C.brown, null, 0), 954, -22);
  put(M.trailer(), 976, -46); put(M.carrier(), 1006, -22); put(M.tree(C.g3), 1020, -34);

  /* いま。TDL の文字、ケーキ、家族、ゴール */
  put(M.letter('T', C.lime), 1040, 40); put(M.letter('D', C.cyan), 1056, 40); put(M.letter('L', C.orange), 1072, 40);
  put(M.cake(), 1060, 24);
  put(M.person(C.lime, C.ink, C.brown, 0), 1048, 20); put(M.person(C.pink, C.ink, null, 0), 1052, 20); put(M.person(C.blue, C.ink, null, 0), 1056, 20); put(M.person(C.yellow, C.brown, null, 0), 1044, 22);
  put(M.sakura(), 1090, 30); put(M.sakura(), 1100, 48);

  /* ================= これから。並木通り（広島市中区） ================= */
  var NK = window.NAMIKI, walker = api.walker, R = api.R, nx;
  if(!NK){ put(M.arch(C.yellow), 1748, 0); return; }   /* 道具箱が読めなかったときは、ここで終わる */
  NK.models(api);
  /* わたる道 */
  put(M.sign(C.blue), 1296, 18); put(M.sign(C.blue), 1310, -18);
  /* 並木と街灯。木の位置はどの案でも動かさない */
  NK.trees(api, NK0 + 10, NK1 - 6, 28);
  for(nx = NK0 + 24; nx < NK1 - 20; nx += 56) put(M.slamp(), nx, -17);
  for(nx = NK0 + 52; nx < NK1 - 20; nx += 56) put(M.slamp(), nx, 16);
  /* 沿道の街並み */
  NK.frontage(api, NK0 + 12, NK1 - 24, 40);
  /* 車道から取り返した縁 */
  for(nx = NK0; nx < NK1; nx += 8){ put(M.kerb(8), nx, -8); put(M.kerb(8), nx, 7); }
  /* 車1台ぶんの場所を、座れる場所に置き換えたもの */
  put(M.parklet(), NK0 + 80, -12); put(M.parklet(), NK0 + 192, -12); put(M.parklet(), NK0 + 304, -12);
  put(M.parklet(), NK0 + 122, 12); put(M.parklet(), NK0 + 234, 12);
  put(M.parasol(C.red), NK0 + 88, -13); put(M.parasol(C.cyan), NK0 + 130, 13); put(M.parasol(C.yellow), NK0 + 312, -13);
  put(M.cafetable(), NK0 + 74, -14); put(M.cafetable(), NK0 + 240, 14); put(M.cafetable(), NK0 + 298, -14);
  put(M.bench(), NK0 + 186, -15); put(M.bench(), NK0 + 228, 15); put(M.bench(), NK0 + 340, -15);
  for(nx = NK0 + 16; nx < NK1 - 24; nx += 28){ put(M.planter(), nx, -19); put(M.planter(), nx + 14, 19); }
  /* 動く建築。13年の仕事と、この道がつながるところ */
  put(M.kei(C.wood, C.red), NK0 + 150, 13); put(M.foodtruck(C.orange), NK0 + 268, -14);
  put(M.stall(C.red), NK0 + 166, 17); put(M.stall(C.blue), NK0 + 280, -18);
  /* 人 */
  var nsh = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple], npa = [C.ink, C.brown, C.navy];
  for(var k = 0; k < 14; k++){
   put(M.person(nsh[k % 8], npa[k % 3], k % 5 === 0 ? C.yellow : null, 0), NK0 + 60 + k * 24, k % 2 ? 15 : -16);
  }
  for(var w = 0; w < 8; w++){
   var ws = nsh[(w + 3) % 8], wp = npa[(w + 1) % 3];
   var wk = walker([M.person(ws, wp, null, 1), M.person(ws, wp, null, 2)], NK0 + 40 + w * 44, w % 2 ? 14 : -15, (w % 2 ? 1 : -1) * (1.1 + R() * 0.6));
   wk.x0 = NK0 + 20; wk.x1 = NK1 - 24; movers.push(wk);
  }

  /* ゴール。街を抜けて、島のはしへ */
  put(M.sakura(), 1724, 26); put(M.sakura(), 1740, 44); put(M.tree(C.g3), 1730, -28); put(M.pine(), 1756, -40);
  put(M.bench(), 1736, 14); put(M.lamp(), 1720, -14);
  put(M.arch(C.yellow), 1748, 0);
  movers.push(anim([M.goalflag(0), M.goalflag(1)], 1758, 0, -12, 3));
 }
};
})();
