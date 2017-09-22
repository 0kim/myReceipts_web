/**
 * Created by ykim on 2017. 9. 21..
 */

var receipt_post_url = "{{MY_RECEIPTS_SERVICE_URL}}";
var new_receipt = {
    "date": "2017-06-05 12:34:56",
    "amount": "0",
    "currency": "KRW",
    "store_name": "Your Store",
    "card_name": "CASH",
    "type": "국내"
};
var token='';

AWSCognito.config.region = '{{AWS_REGION}}';
var poolData = {
    UserPoolId : '{{AWS_COGNITO_USER_POOL_ID}}', // your user pool id here
    ClientId : '{{AWS_COGNITO_CLIENT_ID}}' // your app client id here
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

function set_receipt_val(key, value) {
    new_receipt[key] = value;
}

function show_login_box() {
    $('#receipt_box').remove();
    $('.panel-body').append(e_login_form);
}

function show_receipt_box() {
    $('#login_box').remove();
    $('.panel-body').append(e_receipt_form);
}

function receipt_submit() {
    var d = $('#receipt_datetime').val();
    d = d.replace('T', ' ');
    d += ':00';
    new_receipt['date'] = d;
    new_receipt['amount'] = $('#receipt_amount').val();
    new_receipt['store_name'] = $('#receipt_store').val();

    console.log("Submit the receipt: ");
    console.log(new_receipt);

    var progress_bar='<div class="progress"> \
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 45%"> \
                    <span class="sr-only">45% Complete</span> \
                </div> \
            </div>';

//            progress_bar;
//            var d = $('#receipt_submit_progress_modal');
//            console.log(d);
//            d.append(progress_bar);
//
//            $('#btn_progress_modal').click();

    $.ajax({
        url: receipt_post_url,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        type: 'POST',
        data: JSON.stringify(new_receipt),
        success: function(data) {
            console.log('success: ');
            console.log(data);
            alert("Success");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error: ');
            console.log(jqXHR);
            console.log(textStatus);
            alert("Failed with " + textStatus)
        }
    });
}

function login_action() {
    var username = $('#txt_username').val();
    var password = $('#txt_password').val();
    console.log("sign in by " + username);

    var authenticationData = {
        Username : username, // your username here
        Password : password, // your password here
    };

    var userData = {
        Username : username, // your username here
        Pool : userPool
    };

    var authenticationDetails =
        new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var cognitoUser =
        new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            show_receipt_box();
        },
        onFailure: function(err) {
            alert(err);
        }
    });
}

$( document ).ready( function ()
{
    function init_receipt() {
        var d = new Date();
        var now = {};

        now["year"] = d.getFullYear() + "";
        now["month"] = d.getMonth() < 9 ? "0" + (d.getMonth()+1) : "" + d.getMonth();
        now["date"] = d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate();
        now["hour"] = d.getHours() < 10 ? "0" + d.getHours() : "" + d.getHours();
        now["minute"] = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();

        var now_str = now["year"] + "-" + now["month"] + "-" + now["date"] +
            "T" + now["hour"] + ":" + now["minute"];

        console.log('Set current date to receipt_datetime: ' + now_str );
        $('#receipt_datetime').val(now_str);
    }

    function initialize() {
        // set up events
        $('#btn-refresh').click(function() {location.reload(); });

        // Check existing session
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Unable to get session with stored credential");
                    console.log(err);
                    show_login_box();
                    alert(err);
                    cognitoUser.signOut();
                    return;
                }

                if (session) {
                    token = session.getIdToken().getJwtToken();
                    console.log("you are now logged in.");
                    show_receipt_box();
                    init_receipt();
                    return;
                }
            });
        }
        else
        {
            show_login_box();
        }
    }

    // initializing
    initialize();
});

