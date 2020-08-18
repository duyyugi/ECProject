let urlParams = new URLSearchParams(location.search);
let params = {
    category : 0,
    object : 0,
    user : 0, 
    min: 0,
    max: 5000000,
    limit: 9,
    page: 1,
    sort: 'name',
    search: ''
};
for (let key in params){
    if(!urlParams.has(key)){
        urlParams.append(key, params[key]);
    }
}
let checkboxes = [ 'category','object', 'user'];
for(let key of checkboxes){
    let control = $(`#${key}${urlParams.get(key)}`);
    //console.log(`#${key}${urlParams.get(key)}`);
    if(control) {
        $(control).prop('checked', true);
    }
}
$('#sort').val(urlParams.get('sort'));
$('#limit').val(urlParams.get('limit'));

$('#pagination li').addClass('page-item');
$('#pagination li a').addClass('page-link');
let savePage = urlParams.get('page');
$('#pagination li a').each((index, item) => {
    let page = $(item).attr('href').split('=')[1];
    urlParams.set('page', page);
    let href = '/category?' +urlParams.toString();
    $(item).attr('href', href);
});
urlParams.set('page', savePage);

function selectParam(key, value, reset = false) {
    if(reset){
        for(let key in params){
            urlParams.set(key, params[key]);
        }
    }
    urlParams.set(key, value);
    let url = `/category?${urlParams.toString()}`;
    location.href = url;
}