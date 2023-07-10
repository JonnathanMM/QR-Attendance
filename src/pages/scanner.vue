<template>
  <div class="scanner">
    <div class="scanner-controls">
      <button :class="{ active: isScannerActive }" @click="toggleScanner">
        <span v-if="isScannerActive">Desactivar Escáner</span>
        <span v-else>Activar Escáner</span>
      </button>
    </div>
    <div class="scanner-video">
      <video ref="video" v-show="isScannerActive" autoplay></video>
    </div>

    <div class="search-result" v-if="searchResult">
      <div class="result-container">
        <h2>Nombre: {{ searchResult }}</h2>
      </div>
    </div>

    <div class="message" v-if="message">
      <div class="message-container">
        <h2>{{ message }}</h2>
      </div>
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
  margin-bottom: 50px;
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
  width: 150px;
  height: 150px;
  border: 2px solid #333;
  background-color: #333;
}
</style>

<script>
import qrcode from "qrcode-reader";
import axios from "axios";

export default {
  data() {
    return {
      isScannerActive: false,
      result: null,
      searchResult: null,
      message: null,
      isProcessing: false, // Agregar la propiedad isProcessing
    };
  },
  mounted() {
    this.initializeScanner();
    window.addEventListener("resize", this.adjustVideoSize);
  },
  methods: {
    initializeScanner() {
      this.qr = new qrcode();
      this.qr.callback = (error, result) => {
        if (error) {
          console.error("Error al leer el código QR:", error);
          return;
        }

        this.result = result.result;
        if (this.result !== null) {
          this.performSearch();
        }
      };
    },
    toggleScanner() {
      if (this.isScannerActive) {
        this.stopScanner();
      } else {
        this.startScanner();
      }
    },
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    startScanner() {
      this.isScannerActive = true;
      const constraints = {
        video: {
          facingMode: this.isMobileDevice() ? "environment" : "user",
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          const video = this.$refs.video;
          video.srcObject = stream;

          video.onloadedmetadata = () => {
            video.play();

            this.adjustVideoSize();
            this.scanFrame();
          };
        })
        .catch((error) => {
          console.error("Error al acceder a la cámara:", error);
          this.stopScanner();
        });
    },
    adjustVideoSize() {
      const video = this.$refs.video;
      const scannerVideo = this.$el.querySelector(".scanner-video");
      const scannerVideoRect = scannerVideo.getBoundingClientRect();
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const desiredWidth = scannerVideoRect.width;
      const desiredHeight = scannerVideoRect.width / videoAspectRatio;

      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
    },
    stopScanner() {
      this.isScannerActive = false;
      const video = this.$refs.video;
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    },
    scanFrame() {
      if (this.isScannerActive) {
        const video = this.$refs.video;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          context.drawImage(video, 0, 0, videoWidth, videoHeight);
          this.qr.decode(canvas.toDataURL("image/webp"));
        }

        requestAnimationFrame(this.scanFrame);
      }
    },
    performSearch() {
      if (this.isProcessing) {
        return; // Evitar realizar una nueva solicitud si ya se está procesando una
      }
      this.isProcessing = true; // Marcar como procesando

      // Realizar la búsqueda en el servidor utilizando Axios
      axios
        .get(`https://192.168.100.84:3000/api/registros/${this.result}`)
        .then((response) => {
          // Procesar la respuesta del servidor
          const data2 = response.data;
          const data = data2.nombre;
          // Actualizar el resultado de la búsqueda
          this.searchResult = data;

          // Realizar otra solicitud para comprobar si hay registros
          axios
            .get(
              `https://192.168.100.84:3000/api/attendanceSearch/${this.result}`
            )
            .then((response) => {
              if (response.data == null) {
                // No hay registros existentes, realizar el registro
                axios
                  .post("https://192.168.100.84:3000/api/registroA", {
                    empleado: this.result,
                  })
                  .then(() => {
                    this.message = "Asistencia registrada";
                  })
                  .catch((error) => {
                    console.error(error);
                  })
                  .finally(() => {
                    this.isProcessing = false; // Marcar como no procesando independientemente del resultado de la solicitud
                  });
              } else {
                this.message = "Asistencia existente";
                this.isProcessing = false; // Marcar como no procesando una vez que se complete la solicitud
              }
            })
            .catch((error) => {
              console.error(
                "Error al realizar la búsqueda de registros:",
                error
              );
              this.message = "Error al realizar la búsqueda de registros";
              this.isProcessing = false; // Marcar como no procesando en caso de error
            });
        })
        .catch((error) => {
          console.error("Error al realizar la búsqueda:", error);
          // Manejar el error de manera apropiada, como mostrar un mensaje de error en la interfaz de usuario
          this.message = "Error al realizar la búsqueda";
          this.isProcessing = false; // Marcar como no procesando en caso de error
        });
    },
  },
};
</script>
