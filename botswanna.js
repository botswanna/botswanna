const BotHeader = {
  template:
  ` 
    <div class="chat-header">
      <div class="chat-expand">
        <img
          class="chat-close-icon"
          src="assets/img/chat-close-icon.svg"
          @click="$emit('toggle-display')"
        >
      </div>
      <div class="chat-header-title">
        Botswanna
      </div>
      <div class="chat-close">
        <img
          class="chat-close-icon"
          src="assets/img/chat-close-icon.svg"
          @click="$emit('toggle-display')"
        >
      </div>
    </div>
  `,
};

const Bubble = {
  props: ['type', 'data', 'bubble-index'],
  computed: {
    isBotText: function() {
      return this.type === 'text' && this.data.bot === true
    },
  },
  template:
`
    <div class="bubble">
      <div
        class="text-bubble-container"
        v-if="type === 'text'"
        :style="isBotText ? '' : 'justify-content: flex-end'"
      >
        <img
          class="bot-prof-icon"
          v-if="isBotText === true"
          src="assets/img/botswanna-icon.svg"
        >
        <div
          :class="['text-bubble', data.bot ? 'left-text-bubble' : 'right-text-bubble']"
        >
          {{ data.content }}
        </div>
      </div>

      <div
        v-else-if="type === 'buttons'"
        class="suggestion-btn-container"
      >
        <button
          v-for="(button, index) in data.buttons"
          class="suggestion-btn"
          :key="index"
          :name="button.value"
          @click="$emit('button-click', { value: button.value, index: bubble-index })"
        >
          {{ button.title }}
        </button>
      </div>
    </div>
  `,
};

const BotTextInput = {
  props: {
    value: {
      type: String
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  },
  template:
  `
    <div class="input-box">
        <input
          class="chat-input"
          type="text"
          @input="updateValue($event.target.value)"
          @keyup.enter="$emit('input-submit')"
          placeholder="Type something"
          :value="value"
        ></input>
      <div class="input-submit">
        <img
          class="input-submit-icon"
          src="assets/img/input-submit-icon.svg"
          @click="$emit('input-submit')"
        >
      </div>
    </div>
  `,
};

const BotMinimized = {
  template:
  `
    <div
      class="chat-minimized"
    >
        <img
          class="chat-open-icon"
          src="assets/img/botswanna-icon.svg"
          @click="$emit('toggle-display')"
        >
    </div>
  `,
};

const Botswanna = Vue.extend({
  props: {
    initBubbles: Array,
  },
  components: {
    'bot-header': BotHeader,
    'bubble': Bubble,
    'bot-text-input': BotTextInput,
    'bot-minimized': BotMinimized,
  },
  data: function() {
    return { 
      message: '',
      callback: '',
      bubbles: this.initBubbles,
      displayChat: false,
    };
  },
  updated() {
    this.scroll();
  },
  methods: {
    sendMessage(type, data) {
      // Validate type and data
      this.bubbles.push({ type, data })
    },
    removeMessage(index) {
      // Checking to ensure that remove acts within range of this.bubbles
      // Splice 1 Bubble element out in the array
      this.bubbles.splice(index, 1)
    },
    listen(callback) {
      this.callback = callback
    },
    async _onButtonClick(eventObject) {
      const { value, index } = eventObject
      const data = {
        content: value,
        bot: false
      }
      const type = 'text'
      this.removeMessage(index)
      this.sendMessage(type, data)
      this.callback({ value, trigger: 'button' })
    },
    async _onInputSubmit() {
      // prevent submission of empty messages
      if (this.message !== '') {
        const value = this.message
        const data = {
          content: value,
          bot: false
        }
        const type = 'text'
        this.sendMessage(type, data)
        this.callback({ value, trigger: 'text' })
  
        // Delete value from input
        this.message = ''
      }
    },
    async _toggleDisplay() {
      this.displayChat = !this.displayChat;
    },
    scroll() {
      document.getElementById('bubbles-container').scrollTop = document.getElementById('bubbles-container').scrollHeight;
    },
  },
  mounted() {
    // automatically scroll to the bottom of bubbles-container when window is resized
    window.addEventListener('resize', this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.scroll);
  },
  template:
  `
    <div class="container">
      <!-- Add Botswanna container -->
      <transition name="fade">
        <div 
          class="chat"
          v-show="displayChat"
        >
          <!-- chatbot header -->
          <bot-header
            @toggle-display="_toggleDisplay"
          >
          </bot-header>
          <!-- container which stores the speech bubbles -->
          <div class="bubbles-container" id="bubbles-container">
            <bubble
              v-for="(bubble, index) in bubbles"
              :type="bubble.type"
              :data="bubble.data"
              :key="index"
              :bubble-index="index"
              @button-click="_onButtonClick"
            ></bubble>
          </div>
          <!-- text input box -->
          <bot-text-input
            v-model="message"
            @input-submit="_onInputSubmit"
          >
          </bot-text-input
          >
        </div>
      </transition>
      <transition name="fade">
        <bot-minimized
          v-show="!displayChat"
          @toggle-display="_toggleDisplay"
        >
        </bot-minimized>
      </transition>
    </div>
  `
})
