<template>
  <div class="scanner">
    <div class="scanner-controls">
      <button
        :class="{ active: isScannerActive }"
        @click="toggleScanner"
      >
        <span v-if="isScannerActive">Desactivar Escáner</span>
        <span v-else>Activar Escáner</span>
      </button>
    </div>
    <div class="scanner-video">
      <video ref="video" v-show="isScannerActive" autoplay></video>
    </div>
    <div class="scanner-result" v-if="result">
      Resultado: {{ result }}
    </div>
  </div>
</template>

<style scoped>
.scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scanner-controls {
  margin-bottom: 20px;
}

.scanner-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.scanner-controls button span {
  display: inline-block;
  vertical-align: middle;
  margin-left: 4px;
}

.scanner-controls button.active {
  background-color: #5cb85c;
}

.scanner-video {
  position: relative;
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  margin-bottom: 20px;
}

.scanner-result {
  font-size: 18px;
}
</style>

<script>
import qrcode from 'qrcode-reader';

export default {
  data() {
    return {
      isScannerActive: false,
      result: null
    };
  },
  mounted() {
    this.initializeScanner();
  },
  methods: {
    initializeScanner() {
      this.qr = new qrcode();
      this.qr.callback = (error, result) => {
        if (error) {
          console.error('Error al leer el código QR:', error);
          return;
        }

        this.result = result.result;
      };
    },
    toggleScanner() {
      if (this.isScannerActive) {
        this.stopScanner();
      } else {
        this.startScanner();
      }
    },
    startScanner() {
      this.isScannerActive = true;
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = this.$refs.video;
          video.srcObject = stream;
          video.play();
          this.scanFrame();
        })
        .catch(error => {
          console.error('Error al acceder a la cámara:', error);
          this.stopScanner();
        });
    },
    stopScanner() {
      this.isScannerActive = false;
      const video = this.$refs.video;
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    },
    scanFrame() {
      if (this.isScannerActive) {
        const video = this.$refs.video;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          context.drawImage(video, 0, 0, videoWidth, videoHeight);
          this.qr.decode(canvas.toDataURL('image/webp'));
        }

        requestAnimationFrame(this.scanFrame);
      }
    }
  }
};
</script>
