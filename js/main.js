//if submit button is clicked
$('#submit').click(function () {

    //Get the data from all the fields
    var username = $('input[name=username]');
    var password = $('input[name=password]');

    //Ensure non empty inputs
    if (username.val() == '') {
        username.addClass('hightlight');
        return false;
    } else username.removeClass('hightlight');

    if (password.val() == '') {
        password.addClass('hightlight');
        return false;
    } else password.removeClass('hightlight');

    //organize the data properly
    var data = 'username=' + username.val() + '&password=' + password.val();

    //disabled all the text fields
    $('.text').attr('disabled', 'true');

    //start the loader
    var $this = $('.login'),
        $state = $this.find('button > .state');
    $this.addClass('loading');
    $state.html('Authenticating');

    $this.addClass('error');
    $state.html('Connection timed out!');
    setTimeout(function () {
        $state.html('Log in');
        $this.removeClass('ok loading');
        $('.text').removeAttr('disabled');
        $("#username").focus();
    }, 4000)

    //start the ajax
    $.ajax({
        //this is the php file that processes the data and send mail
        url: "/auth.php",

        //GET method is used
        type: "GET",

        //pass the data
        data: data,

        //Do not cache the page
        cache: false,

        //success
        success: function (html) {
            if (html == 1) {
                //if process.php returned 1/true
                $this.addClass('ok');
                $state.html('Welcome back!');
                setTimeout(function () {
                    window.open("https://test.lucacastelnuovo.nl", "_self")
                }, 1000)
            } else {
                //if process.php returned 0/false
                $this.addClass('error');
                $state.html('Username and Password did not match!');
                setTimeout(function () {
                    $state.html('Log in');
                    $this.removeClass('ok loading');
                    $('.text').removeAttr('disabled');
                    $("#username").focus();
                }, 1000)
            };
        }
    });

    //cancel the submit button default behaviours
    return false;
});