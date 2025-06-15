$(document).ready(function() {
  const $stationsContainer = $('#stations-container');
  const $playerControls = $('#player-controls');
  const $audioPlayer = $('#audio-player')[0];
  const $currentStationImage = $('#current-station-image');
  const $currentStationName = $('#current-station-name');
  const $playPauseButton = $('#play-pause-button');
  const $playIcon = $('#play-icon');
  const $pauseIcon = $('#pause-icon');
  const $muteButton = $('#mute-button');
  const $volumeIcon = $('#volume-icon');
  const $muteIcon = $('#mute-icon');
  const $volumeSlider = $('#volume-slider'); // Added volume slider

  let currentStation = null;
  let isPlaying = false;

  // Set default volume
  $audioPlayer.volume = 0.5;
  $volumeSlider.val(0.5); // Set slider to 50%

  // Fetch stations data
  $.getJSON('./data/stations.json', function(stationsData) {
    // Render station cards
    function renderStations() {
      const stations = stationsData.stations;

      Object.entries(stations).forEach(([key, station]) => {
        const $stationCard = $(`
          <div class="station-card" data-key="${key}">
            <div class="station-image-container">
              <img src="${station.image}" alt="${station.name}" class="station-image">
              <div class="station-overlay">
                <h3 class="station-name">${station.name}</h3>
              </div>
              <div class="playing-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </div>
            </div>
          </div>
        `);

        $stationsContainer.append($stationCard);
      });
    }

    // Handle station selection
    function handleStationSelect(stationKey) {
      const stations = stationsData.stations;
      const station = stations[stationKey];

      // If clicking on the currently playing station, toggle play/pause
      if (currentStation && currentStation.url === station.url && isPlaying) {
        pauseAudio();
      } else {
        // Update current station
        currentStation = station;

        // Update player UI
        $currentStationImage.attr('src', station.image);
        $currentStationName.text(station.name);
        $playerControls.removeClass('hidden');

        // Update station cards
        $('.station-card').removeClass('active');
        $(`.station-card[data-key="${stationKey}"]`).addClass('active');

        // Play audio
        playAudio(station.url);
      }
    }

    // Play audio
    function playAudio(url) {
      $audioPlayer.src = url;

      const playPromise = $audioPlayer.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            updatePlayPauseButton();
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            updatePlayPauseButton();
          });
      }
    }

    // Pause audio
    function pauseAudio() {
      $audioPlayer.pause();
      isPlaying = false;
      updatePlayPauseButton();
    }

    // Toggle play/pause
    function togglePlayPause() {
      if (!currentStation) return;

      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio(currentStation.url);
      }
    }

    // Toggle mute
    function toggleMute() {
      $audioPlayer.muted = !$audioPlayer.muted;
      updateMuteButton();
    }

    // Update play/pause button
    function updatePlayPauseButton() {
      if (isPlaying) {
        $playIcon.addClass('hidden');
        $pauseIcon.removeClass('hidden');
      } else {
        $playIcon.removeClass('hidden');
        $pauseIcon.addClass('hidden');
      }
    }

    // Update mute button
    function updateMuteButton() {
      if ($audioPlayer.muted) {
        $volumeIcon.addClass('hidden');
        $muteIcon.removeClass('hidden');
      } else {
        $volumeIcon.removeClass('hidden');
        $muteIcon.addClass('hidden');
      }
    }

    // Event listeners
    $stationsContainer.on('click', '.station-card', function() {
      const stationKey = $(this).data('key');
      handleStationSelect(stationKey);
    });

    $playPauseButton.on('click', togglePlayPause);
    $muteButton.on('click', toggleMute);

    // Volume Slider Event Listener
    $volumeSlider.on('input', function() {
      $audioPlayer.volume = $(this).val();
    });

    // Initialize
    renderStations();
  }).fail(function(jqxhr, textStatus, error) {
    console.error("Error loading stations data:", error);
  });
});
