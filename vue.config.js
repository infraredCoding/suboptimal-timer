const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Suboptimal Timer",
    themeColor: '#122333',
  }
})
