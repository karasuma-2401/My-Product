/**
         * 1.Render song
         * 2. scroll top
         * 3. play/ pause/ seek
         * 4. CD rotate
         * 5. Next/ previous
         * 6. random
         * 7. next / repeat when ended
         * 8. Active song
         * 9. Scroll active song into 
         * 10. play song when click
         */ 

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'FAMILY_PLAYER'

const player = $('.player')
const cd = $('.cd');
const cdWidth = cd.offsetWidth
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio') 
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $ ('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const volumeSlider = $('#volume-slider');
const audio_ = $("audio");
var shuffleArray = []
// dark mode
const darkModeSwitch = document.getElementById("darkModeSwitch");
const body = document.body;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isDarkMode: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bỉ Ngạn nở hoa Người không về',
            singer: 'Huang Jing Mei',
            path: './assets/music/Bỉ Ngạn Nở Hoa Người Không Về.m4a',
            image: './assets/img/Bỉ Ngạn Hoa Nở Người Không Về.jpg',
        },
        {
            name: 'Đáp án của bạn',
            singer: 'Lưu Đào (刘涛)',
            path: './assets/music/Đáp Án Của Bạn.mp3',
            image: './assets/img/Đáp Án Của Bạn.jpg',
        },
        {
            name: 'Giày cao gót màu đỏ',
            singer: 'Thái Kiện Nhã (蔡健雅)',
            path: './assets/music/Giày Cao Gót Màu Đỏ.mp3',
            image: './assets/img/Giày Cao Gót Màu Đỏ.jpg',
        },
        {
            name: 'Một triệu khả năng',
            singer: 'Christine Welch (克丽丝叮)',
            path: './assets/music/Một Triệu Khả Năng.mp3',
            image: './assets/img/Một Triệu Khả năng.jpg',
        },
        {
            name: 'Tam bái hồng trần lương',
            singer: 'Lưu Chí Viễn (刘志远)',
            path: './assets/music/Tam Bái Hồng Trần Lương.mp3',
            image: './assets/img/Tam Bái Hồng Trần Lương.jpg',
        },
        {
            name: 'Tát nhật lãng rực rỡ',
            singer: 'Lưu Tân Khuyên (刘新圈)',
            path: './assets/music/Tát Nhật Lãng Rực Rỡ.m4a',
            image: './assets/img/Tát Nhật Lãng Rực rỡ.jpg',
        },
        {
            name: 'Tay trái chỉ trăng',
            singer: 'Tát Đỉnh Đỉnh (萨顶顶)',
            path: './assets/music/Tay Trái Chỉ Trăng.mp3',
            image: './assets/img/Tay Trái Chỉ Trăng.jpg',
        },
        {
            name: 'Thời không sai lệch',
            singer: 'Ngải Thần (艾辰)',
            path: './assets/music/Thời Không Sai Lệch.mp3',
            image: './assets/img/Thời Không Sai Lệch.jpg',
        },
        {
            name: 'Tử cửu môn hồi ức',
            singer: 'Trùng Nhị Điên (虫二颠)',
            path: './assets/music/Tử Cửu Môn Hồi Ức.mp3',
            image: './assets/img/Tử Cửu Môn Hồi Ức.jpg',
        },
        {
            name: 'Xích linh',
            singer: 'Lý Kiến Hoành (李建衡) và Thanh Ngạn (清彦)',
            path: './assets/music/Xích Linh.mp3',
            image: './assets/img/Xích Linh.jpg',
        }
    ],
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    
    render: function() {
        const htmls = this.songs.map ((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        });

        playList.innerHTML = htmls.join('');
    },
    
    defineProperties: function() {
        Object.defineProperty( this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this
        // CD rotate
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        // Xử lý khi zoom in /out
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;  
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0px';
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // play / pause
        playBtn.onclick = function() {
            if (_this.isPlaying)
                audio.pause();
            else
                audio.play()
        }
        // song plays
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add ('playing');
            cdThumbAnimate.play();
        }
        // song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        // Progress bị change
        audio.ontimeupdate = function() {
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

                progress.style.background = `linear-gradient(to right, #ff416c ${progressPercent}%, #d3d3d3 ${progressPercent}%)`;
            }
        }
        // khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration/ 100 * e.target.value
            audio.currentTime = seekTime 

            progress.style.background = `linear-gradient(to right, #ff416c ${e.target.value}%, #d3d3d3 ${e.target.value}%)`;
        }
        // next song
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong();
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // random 
        randomBtn.onclick = function() {
            _this.isRandom = ! _this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        } 
        // repeat infinity song
        repeatBtn.onclick = function() {
            _this.isRepeat = ! _this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)

        }
        // dark mode
        darkModeSwitch.onclick = function(){
            _this.isDarkMode = !_this.isDarkMode; 
            _this.setConfig('isDarkMode', !_this.isDarkMode);
            body.classList.toggle('dark-mode', !_this.isDarkMode);
        };        
        // when radio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }
            else {
                nextBtn.click();    
            }
        }
        // keyboard on playlist
        document.addEventListener('keydown', function (event) {
            switch (event.code) {
                case 'Space': 
                    event.preventDefault();
                    playBtn.click();
                    break;
                case 'ArrowRight': 
                    nextBtn.click();
                    break;
                case 'ArrowLeft': 
                    prevBtn.click();
                    break;
                case 'KeyR': 
                    repeatBtn.click();
                    break;
                case 'KeyS': 
                    randomBtn.click();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (audio.volume < 1) {
                        audio.volume = Math.min(audio.volume + 0.05, 1); 
                        volumeSlider.value = audio.volume * 100;  
                        _this.updateVolumeUI();
                    }
                    break;
                case 'ArrowDown': 
                    event.preventDefault();
                    if (audio.volume > 0) {
                        audio.volume = Math.max(audio.volume - 0.05, 0); 
                        volumeSlider.value = audio.volume * 100;  
                        _this.updateVolumeUI();
                    }
                break;
            }   
        });   
        // click in playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')){
                // click in song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    audio.play()
                    _this.render()
                }
            }
        }
    },
    
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        },200)
    },
    
    loadConfig: function () {
        this.isRandom = this.config.isRandom ||false
        this.isRepeat = this.config.isRepeat || false
        this.isDarkMode = this.config.isDarkMode ?? false

        if (this.isRandom){
            randomBtn.classList.add('active')
        }
        if (app.isRepeat){
            repeatBtn.classList.add('active')
        }
        if (app.isDarkMode){
            body.classList.add("dark-mode");
        }   
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex>= this.songs.length){
            this.currentIndex =0;
        }
        this.loadCurrentSong();
    },
    
    prevSong: function() {
        this.currentIndex --;
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong();
    },
    
    playRandomSong: function() {
        let songs = $$ ('.song')
        songs[this.currentIndex].classList.remove('active')
        // if all songs have been played, shuffled the songs again
        if (shuffleArray.length ===0) {
            shuffleArray = [...this.songs]
            //apply Fisher Yates
            for (let i = shuffleArray.length -1; i > 0; i--){
                const j = Math.floor (Math.random() * (i+1))
                var temp = shuffleArray[i]
                shuffleArray[i] = shuffleArray[j]
                shuffleArray[j] = temp
            }
        }

        // get the next song
        const nextSong = shuffleArray.pop();
        // update the current index and load the song
        this.currentIndex = this.songs.indexOf(nextSong);
        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong()
    
    },
    updateVolumeUI: function() {
        let volumePercent = audio.volume * 100;
        volumeSlider.style.background = `linear-gradient(to right, var(--primary-color) ${volumePercent}%, #d3d3d3 ${volumePercent}%)`;
    },
    start: function() {
        // Gán cấu hình từ config vào app
        this.loadConfig()
        // Định nghĩa các thuộc tính của object
        this.defineProperties();
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();
        // Load information của bài hát đầu tiên lên UI
        this.loadCurrentSong();
        // render playlist
        this.render();
        //
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        body.classList.toggle ('dark-mode', !this.isDarkMode)
    }
}
app.start();



