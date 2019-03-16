const deleteProduct = (btn) => {

    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then((response) => {
            console.log(response);

        })
        .catch((error) => {
            console.log(error);

        })

}