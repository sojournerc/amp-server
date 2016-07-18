
window.onload = (ev) => {
  const form = document.getElementById('some-test-form');
  form. addEventListener('submit', (ev) => {
    ev.preventDefault();
    new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      const path = `/submit/test`;
      const onReadyStateChange = () => {
        if (xhr.readyState === 4) {
          const data = xhr.response && JSON.parse(xhr.response);
          if (xhr.status && /^2/.test(xhr.status)) {
            res(data);
          } else {
            rej(xhr);
          }
        }
      };
      const sendForm = () => {
        const formData = new FormData(ev.target);
        xhr.addEventListener('readystatechange', onReadyStateChange, false);
        xhr.open('post', path, true);
        xhr.send(formData);
      };
      sendForm()
    })
    .then(data => {
      console.info('DATA', data);
      ev.target.parentNode.removeChild(ev.target);
      const content = document.getElementById('content-body');
      const h3 = document.createElement('h5');
      h3.innerHTML = 'SUCCESS!';
      content.appendChild(h3);
      R.mapObjIndexed((d, k) => {
        const div = document.createElement('div')
        div.innerHTML = `${k}: ${d}`;
        content.appendChild(div);
      }, data);
    })
    .catch(err => { console.error(err) });
  });
}
