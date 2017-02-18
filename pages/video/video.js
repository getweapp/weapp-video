import videoAPI from '../../api/video.js'
import wordAPI from '../../api/word.js'
import WxParse from '../../wxParse/wxParse.js'

//获取应用实例
var app = getApp()
Page({
  data: {
    video: {},
    navTab: ["字幕", "讲解", "评论"],
    points: [],
    zhs: [],
    currentNavtab: "0",
    isLoading: true,

    //dict
    show: false,
    word: '',
    prononce: '',
    action: {
      method: ''
    }
  },

  onLoad(options) {
    const v = videoAPI.loadVideoById(options.id);

    //将单词化后的字幕通过html形式展示
    const frsArray = v.parsed_content.split('||');
    const length = frsArray.length;
    for (let i = 0; i < length; i++) {
      WxParse.wxParse('fr' + i, 'html', frsArray[i], this);
      if (i === length - 1) {
        WxParse.wxParseTemArray("frs", 'fr', length, this)
      }
    }
    this.setData({
      video: v,
      points: v.points.split(','),
      zhs: v.parsed_content_zh.split('||')
    });

    wx.setNavigationBarTitle({
      title: v.title,
    })
  },

  /**
   * 页面加载完成时获取video
   */
  onReady() {
    this.videoContext = wx.createVideoContext('mainVideo')
    WxParse.wxParse('description', 'html', this.data.video.parsed_desc, this);
  },

  /**
   * 切换tab
   * @param e
   */
  switchTab(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  /**
   * 查询该单词的解释，并显示结果
   * @param e
   */
  showDict(e) {
    const w = e.currentTarget.dataset.word;
    this.setData({
      show: true,
      word: w,
    });

    WxParse.wxParse('explication', 'html', '加载中...', this);

    const result = wordAPI.loadWord(w);
    this.setData({
      prononce: result.audio
    });
    WxParse.wxParse('explication', 'html', result.msg, this);
  },

  /**
   * 跳转视频播放进度到e.to
   * @param e
   */
  seekTo(e) {
    const to = e.currentTarget.dataset.to;
    this.videoContext.seek(to);
  },

  /**
   * Play prononce audio
   */
  playAudio() {
    this.setData({
      action: {
        method: 'play'
      }
    })
  },
})
