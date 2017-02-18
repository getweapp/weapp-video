//index.js
import videosAPI from '../../api/videos.js'
import carouselsAPI from '../../api/carousels.js'

//获取应用实例
const app = getApp()

Page({
  data: {
    hasMore: true,
    initLoading: true,
    reloading: false,
    autoplay: true,
    duration: 1000,
    interval: 5000,
    indicatorDots: true,
    videos : [],
    pages : 1,
    imgUrls: []
  },

  //事件处理函数
  onVideoClick(event) {
    event.target.dataset.alphaBeta;
    wx.navigateTo({
      url: '../video/video'
    })
  },

  onLoad() {
    this.refresh();
    this.initCarousel();
  },

  initCarousel() {
    this.setData({
      imgUrls: carouselsAPI.loadCarousels()
    });
  },

  reloadVideos() {
    this.setData({ reloading: true});
    const that = this;
    setTimeout(function () { that.refresh(); }, 2000);
  },

  loadMoreVideos() {
    let that = this;
    setTimeout(() => {
      that.setData({
        videos: [...that.data.videos, ...videosAPI.loadVideos(that.data.page, 10).data],
        page: that.data.page ++
      })
    }, 1000);

  },

  refresh() {
    this.setData({
      videos: videosAPI.loadVideos(1, 10).data,
      page: 1,
      initLoading: false,
      reloading: false,
    });
  },

  onPullDownRefresh: function () {
    console.log('onPullDownRefresh', new Date())
  },
})
