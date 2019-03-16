const deleteProduct = (btn) => {

    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
    // clisest element
    const productElement = btn.closest('article')

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then((response) => {
            console.log(response);

        })
        .then((data) => {
            console.log(data);
            productElement.parentNode.removeChild(productElement)

        })
        .catch((error) => {
            console.log(error);

        })

}