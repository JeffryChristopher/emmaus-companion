/* ============================================================
   TOPIK 1, Pencarian akan Makna Hidup dan Keupayaan Kita
             Terhadap Tuhan
   Sumber: "PD_ IKD_Calon_Tp01 Pencarian Makna Hidup.pdf"

   The teaching text below is transcribed VERBATIM from the Bahasa
   Malaysia note approved under the Imprimatur. Do not paraphrase,
   shorten or "improve" it, and do not translate it from the English
   note, this is its own approved text. Proofread against the PDF
   before publishing.

   Transcription notes for the proofreader:
     · The source cites the Catechism as "KKK 27-28" in point 5 and
       "KGK 150" in point 9. Both are reproduced exactly as printed.
     · The `marginal` notes and the questions of the Part E journal
       are the app's own wording, not the note's, see README.md.
     · `passage` gives the English chapter the Bible link opens; the
       printed reference itself stays in Bahasa Malaysia.

   Journal ids and question counts MUST match content/topics/en/
   topic-01.js: a candidate's answers are stored against the topic,
   not the language, so they survive a change of language.
   ============================================================ */

window.RCIA = window.RCIA || {};
window.RCIA.topics = window.RCIA.topics || {};
window.RCIA.topics.ms = window.RCIA.topics.ms || {};

window.RCIA.topics.ms[1] = {
  topic: 1,
  session: 2,
  period: 'A',
  lang: 'ms',
  template: 'standard',
  title: 'Pencarian akan Makna Hidup dan Keupayaan Kita Terhadap Tuhan',
  topicQuestion: 'Mengapa IKD?',
  status: 'draft',

  parts: [
    /* -------------------------------------------------- A */
    {
      letter: 'A',
      name: 'Pengalaman Hidup',
      blocks: [
        { type: 'label', text: 'Pengenalan:' },
        { type: 'lead', text: 'Manusia mencari identiti atas pelbagai sebab, termasuk keinginan untuk memiliki rasa kekitaan, pemahaman diri, dan hubungan dengan orang lain. Membentuk identiti membantu individu memahami siapa diri mereka, apa yang mereka hargai, dan di mana kedudukan mereka di dunia ini. Identiti seseorang boleh dibentuk oleh pelbagai faktor seperti budaya, keluarga, pengalaman, dan kepercayaan peribadi. Ia juga menyediakan kerangka untuk membuat pilihan, membina hubungan dan mencari tujuan dalam hidup.' },
        {
          type: 'journal',
          id: 'A',
          prompt: 'Soalan untuk renungan dan perkongsian.',
          questions: [
            { n: '1.', text: 'Apakah yang memberi makna kepada hidup saya?' },
            { n: '2.', text: 'Apakah yang saya cari dan di manakah saya menemuinya?' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- B */
    {
      letter: 'B',
      name: 'Kitab Suci',
      ref: 'Yohanes 1:35-51',
      passage: 'John 1',
      blocks: [
        {
          type: 'pericope',
          cite: 'Kitab Suci Yohanes 1:35-51 – Murid-murid Yesus yang Pertama:',
          passage: 'John 1',
          instruction: 'Baca Teks dan sediakan jawapan bagi soalan-soalan di bawah:'
        },
        {
          type: 'journal',
          id: 'B',
          questions: [
            { n: '1.', text: 'Apakah yang berlaku dalam Yoh 1:35-51?' },
            { n: '2.', text: 'Apakah pengajaran dalam Yoh 1:35-42?' },
            { n: '3.', text: 'Apakah makna Yoh 1:35-36?' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- C */
    {
      letter: 'C',
      name: 'Topik Hari Ini',
      ref: 'Pencarian Kita akan Makna Hidup dan Keupayaan Kita terhadap Tuhan',
      blocks: [
        {
          type: 'points',
          items: [
            {
              title: 'Apakah itu Kehidupan?', joiner: ' ',
              body: 'Kehidupan merangkumi pelbagai aspek keinginan untuk bahagia, dikasihi, mengecap kedamaian, memperoleh kuasa, dan banyak lagi. Makna kehidupan sering berubah mengikut tujuan setiap individu kerana hidup merupakan satu fenomena yang dinamik; ia bagaikan sebuah pemboleh ubah yang nilainya sentiasa dipengaruhi oleh emosi, situasi, dan persekitaran. Hakikatnya, setiap insan mempunyai kerinduan yang mendalam dan tidak pernah puas untuk mencari makna hidup yang sejati.'
            },
            {
              title: 'Mengapakah hidup kadangkala kelihatan tidak bermakna?', joiner: ' ',
              body: 'Kehidupan boleh hilang serinya apabila kita mula kehilangan arah dan tujuan, atau apabila tiada lagi perkara baharu yang dapat menyalakan semula semangat diri.'
            },
            {
              title: 'KASIH adalah kebaikan tertinggi yang memuaskan hati manusia', joiner: ' – ',
              body: '“Kasih” itu adalah matlamat utama dan tertinggi yang boleh kita aspirasikan, dan penyelamatan kita adalah melalui kasih dan dalam kasih.'
            },
            {
              title: 'Pencapaian swa-nyata hanya mungkin berlaku sebagai kesan sampingan daripada swa-transendensi.', joiner: ' ',
              body: 'Semakin kita melupakan kepentingan diri demi mengabdikan jiwa kepada suatu perjuangan, atau demi mengasihi sesama insan, semakin utuh kita merealisasikan potensi diri yang sebenar.'
            },
            {
              title: 'Keupayaan kita terhadap Tuhan memanggil kita untuk mencari Tuhan (KKK 27-28)', joiner: ' – ',
              body: 'Tuhan telah meletakkan keinginan terhadap Diri-Nya dalam setiap insan. Keinginan itu tertulis dalam hati manusia untuk memudahkan pencarian kita, dan Tuhan tidak pernah berhenti menarik kita kepada Diri-Nya. Kita dipanggil untuk berbicara dengan Tuhan dan berada dalam persekutuan dengan-Nya.',
              marginal: { mark: 'KKK', text: '27–28, Keinginan terhadap Tuhan tertulis dalam hati manusia.' }
            },
            {
              title: 'Menemui Tuhan dalam kehidupan.', joiner: ' ',
              body: 'Manusia dikurniakan dengan kesedaran moral dalam diri dan, melalui suara hati, digerakkan untuk mencari serta mempercayai kewujudan Tuhan. Hal ini menunjukkan bahawa umat manusia memiliki jiwa rohani iaitu benih keabadian yang datang secara langsung daripada Tuhan.'
            },
            {
              title: 'Peranan akal budi manusia dalam mengenali Tuhan.', joiner: ' ',
              body: 'Kita menyedari kewujudan Tuhan melalui hujah-hujah yang menumpu serta meyakinkan, yang seterusnya membuka jalan bagi kita untuk mengenali-Nya dengan lebih mendalam. Bukti-bukti ini boleh ditemui dalam alam fizikal dan juga alam rohani kita.'
            },
            {
              title: 'Bukti kewujudan Tuhan.', joiner: ' ',
              body: 'Kewujudan Tuhan boleh dibuktikan dalam lima cara, menurut Santo Thomas Aquinas.'
            },
            {
              title: 'Iman merupakan jalan kedua untuk kita mengenali Tuhan.', joiner: ' ',
              body: 'Ia adalah pegangan teguh terhadap sesuatu yang tidak mampu dibuktikan oleh logik akal, mahupun dikesan oleh lima pancaindera. Iman adalah satu tindakan manusia yang bebas, yang merangkumi dimensi peribadi dan komuniti. ‘Iman utamanya adalah penyerahan peribadi . . . kepada Tuhan. Pada masa yang sama, ia merupakan persetujuan bebas terhadap seluruh kebenaran yang telah diwahyukan oleh-Nya’ (KGK 150).',
              marginal: { mark: 'KGK', text: '150, Iman ialah penyerahan peribadi kepada Tuhan, dan persetujuan bebas terhadap kebenaran yang diwahyukan-Nya.' }
            },
            {
              title: 'Wahyu Tuhan kepada umat manusia.', joiner: ' ',
              body: 'Tuhan telah menyatakan rancangan kekal-Nya dengan mengutus Putera-Nya, Yesus Kristus, dan Roh Kudus (sebuah misteri yang hanya disingkapkan pada zaman akhir ini). Tuhan mahu seluruh umat manusia mempunyai jalan masuk kepada-Nya melalui Kristus dan dalam Roh Kudus (Ef 1:9, 2:18).',
              marginal: { mark: 'Kitab Suci', text: 'Efesus 1:9; 2:18', passage: 'Ephesians 1' }
            }
          ]
        }
      ]
    },

    /* -------------------------------------------------- D */
    {
      letter: 'D',
      name: 'Santo Bagi Topik Ini',
      blocks: [
        {
          type: 'saint',
          name: 'Santo Thomas Aquinas',
          alsoKnown: 'nama asal: Tommaso d’Aquino',
          monogram: 'T',
          image: null,
          imageCaption: null,
          facts: [
            { label: 'Hari Pesta', value: '28 Januari.' },
            { label: 'Penaung', value: 'Para pelajar dan semua universiti.' },
            { label: 'Kelahiran', value: 'lwn. 1226 Roccasecca, Sicily.' },
            { label: 'Kematian', value: '7 Mac 1274 (berusia 48–49) Fossanova, Negara-negara Paus.' }
          ],
          paragraphs: [
            'Beliau merupakan seorang biarawan Dominikan dan imam Itali, seorang ahli falsafah dan ahli teologi yang berpengaruh, serta seorang pakar undang-undang dalam tradisi skolastik dari wilayah Aquino di Kerajaan Sicily. Thomas Aquinas merupakan salah seorang ahli teologi terbesar Gereja Katolik, seorang Doktor Gereja dan jurucakap utama bagi tradisi Katolik dalam hal akal budi dan wahyu ilahi.',
            'Karya Thomas yang paling terkenal adalah Summa Theologica, atau Summa Theologiae, yang belum selesai, yang mengandungi lima bukti kewujudan Tuhan, juga dikenali sebagai “Lima Jalan Aquinas”. Lima jalan tersebut adalah:'
          ],
          list: [
            'Jalan Pertama: Tuhan sebagai Penggerak Utama',
            'Jalan Kedua: Tuhan sebagai Sebab Pertama',
            'Jalan Ketiga: Tuhan sebagai Makhluk yang Wujud',
            'Jalan Keempat: Tuhan sebagai Makhluk yang Mutlak',
            'Jalan Kelima: Tuhan sebagai Pereka Agung'
          ],
          listStyle: 'numbered',
          sources: [
            'https://www.franciscanmedia.org/saint-of-the-day/saint-thomas-aquinas/',
            'https://www.catholic.org/saints/saint.php?saint_id=2530'
          ]
        }
      ]
    },

    /* -------------------------------------------------- E */
    {
      letter: 'E',
      name: 'Aktiviti Peribadi & Renungan',
      ref: 'Berjalan bersama Tuhan',
      blocks: [
        { type: 'para', text: 'Berjalan-jalanlah dan perhatikan segala perkara di sekeliling anda, alam semula jadi, burung-burung di udara, dan orang-orang yang anda lihat:' },
        {
          type: 'list',
          items: [
            'Cuba lihat tangan Tuhan dalam setiap ciptaan.',
            'Cuba fikirkan tujuan bagi perkara-perkara yang anda lihat.',
            'Kagumilah keindahan dalam setiap perkara yang anda lihat dan bersyukurlah kepada Tuhan kerana setiap yang dicipta mempunyai sebab dan tujuan, sama seperti anda.'
          ]
        },
        { type: 'label', text: 'Merenung Pengalaman Kita:' },
        {
          type: 'versicle',
          text: '“TUHAN menjadikan segala sesuatu, masing-masing untuk tujuan-Nya, bahkan orang durjana untuk hari malapetaka.” (AVB)',
          ref: 'Amsal 16:4',
          passage: 'Proverbs 16'
        },
        { type: 'para', text: 'Pejamkan mata dan ambil masa sejenak untuk merenung petikan ini. Gambarkan dalam minda segala yang dilihat semasa berjalan tadi, sambil memikirkan tujuan di sebalik perkara-perkara yang telah diperhatikan. Bersyukurlah kepada Tuhan atas segala kebaikan dalam hidup, bermula dengan diri sendiri, dan berdoalah untuk perkara-perkara yang dirasakan buruk serta mengganggu. Rasakan kasih Tuhan saat memuji dan bersyukur kepada-Nya atas segala-galanya. Ucapkanlah doa kesyukuran yang ringkas.' },
        {
          type: 'journal',
          id: 'E',
          prompt: 'Perjalanan anda bersama Tuhan, tuliskan apa yang anda lihat, dan doa kesyukuran yang anda panjatkan.',
          questions: [
            { n: '❧', text: 'Apakah yang saya lihat semasa berjalan, dan apakah tujuan yang saya fikirkan di sebaliknya?' },
            { n: '❧', text: 'Doa kesyukuran ringkas saya.' }
          ]
        },
        {
          type: 'prayer',
          label: 'Contoh',
          lines: [
            'Bapa Syurgawi, terima kasih kerana mengasihi saya dan atas segala ciptaan-Mu yang indah. Kurniakanlah saya rahmat untuk mengenali dan mengasihi-Mu, serta memahami rencana-Mu dalam hidup saya.',
            'Bantulah saya untuk sentiasa menghargai keindahan alam semula jadi dan setiap insan yang telah Engkau tempatkan di jalan hidup saya.',
            'Dalam nama Yesus, saya panjatkan doa ini. Amin.'
          ]
        }
      ]
    }
  ]
};
