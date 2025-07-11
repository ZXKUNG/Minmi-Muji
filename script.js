document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const seekBar = document.getElementById('seekBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');

    // --- ฟังก์ชัน Play/Pause ---
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    // --- อัปเดตไอคอนเมื่อสถานะการเล่นเปลี่ยน ---
    audio.onplay = () => {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    };

    audio.onpause = () => {
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    };

    // --- ฟังก์ชันแปลงเวลา ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- ตั้งค่าเมื่อโหลดเพลงเสร็จ ---
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
        seekBar.max = audio.duration;
    });

    // --- อัปเดตแถบเวลาและเวลาปัจจุบันขณะเล่น ---
    audio.addEventListener('timeupdate', () => {
        seekBar.value = audio.currentTime;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // --- ควบคุมการ Seek (กรอเพลง) ---
    seekBar.addEventListener('input', () => {
        audio.currentTime = seekBar.value;
    });

    // --- ควบคุมการปรับเสียง ---
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });
    
    // --- พยายามเล่นเพลงอัตโนมัติเมื่อเข้าเว็บ ---
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay was prevented by the browser.");
        });
    }
});
