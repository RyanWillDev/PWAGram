var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(res => {
      console.log(res.outcome);

      if (res.outcome === 'dismissed') {
        console.log('user cancelled installation');
      } else {
        console.log('User added to home screen');
      }

      deferredPrompt = null;
    });
  }

}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
