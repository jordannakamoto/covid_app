// register.js
$('#register_btn').click( function(){
        var form = $('#register_form');
        var username = $('#register_name').val();
        var password = $('#register_password').val();
        var confirm = $('#register_confirmpassword').val();
        var msg = $('#message');
        
        if(username.length < 1){
            msg.text("Username cannot be empty.");
            return false;
        }
        else if(password.length <1){
            msg.text("Password cannot be empty");
            return false;
        }
        else if(password != confirm){
            msg.text("Password didn't match, try again.");
            return false;
        }
        else if(password == confirm){
            form.submit(function(){
                $('#register_confirmpassword').prop('disabled', true);
            });
        }
});