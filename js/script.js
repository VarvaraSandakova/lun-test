$(document).ready(function () {
    // most used elements
    var cities = [];
    var countrySelect = $('.search.country');
    var currentPage = 1;
    var finishTest = $('.finish-test');
    var nextStep = $('.next');
    var previousStep = $('.previous');
    var page4 = $('.page4');
    var userName = $('.name');
    var userEmail = $('.email');
    var userCountry = $('.country');
    var paginationItems = $('.pagination li');
    var appPages = $('div.page');

    function start() {
        resetPageDisplaying();

        $.getJSON('countries.json', function(data) {
            $.each(data, function(key, val) {
                userCountry.append('<option value="' + key + '">' + val + '</option>');
            });
        });
        $.getJSON('cities.json', function(data) {
            $.each(data, function(key, val) {
                cities.push(val);
            })
        });
    }
    function resetPageDisplaying() {
        paginationItems.removeClass('available');
        $('.pagination li[data-num="1"]').addClass('available');
        appPages.removeClass('active');
        $('div.page1').addClass('active');
    }
    function checkSocialNetwork(networkValue, network, errorNumber) {
        if(networkValue[0] && !networkValue.val()) {
            showErrorMessage('.error-' + network);
            return ++errorNumber;
        } else if(networkValue[0]) {
            localStorage.setItem(network, networkValue.val())
        }
        return errorNumber;
    }
    function getUsersInfo() {
        $('.result-inform .result-name').html(localStorage.getItem('name'));
        $('.result-inform .result-email').html(localStorage.getItem('email'));
        $('.result-inform .result-country').html(localStorage.getItem('country'));
        $('.result-inform .result-city').html(localStorage.getItem('city'));
        $('.result-img').find('img').attr('src', localStorage.getItem('logo-src'));

        if( $('#facebook').prop('checked') ==true){
            $('.social-network .fb').removeClass('hide').addClass('show');
            $('.social-network .fb span').html(localStorage.getItem('facebook'));
        }
        if( $('#twitter').prop('checked') == true){
            $('.social-network .tw').removeClass('hide').addClass('show');
            $('.social-network .tw span').html(localStorage.getItem('twitter'));
        }
        if( $('#vk').prop('checked') == true){
            $('.social-network .vk').removeClass('hide').addClass('show');
            $('.social-network .vk span').html(localStorage.getItem('vk'));
        }
        if( $('#od').prop('checked') == true){
            $('.social-network .od').removeClass('hide').addClass('show');
            $('.social-network .od span').html(localStorage.getItem('od'));
        }
    }
    function checkLastPageBeforeResult() {
        if(page4.hasClass('active')) {
            finishTest.addClass('show');
            nextStep.removeClass('show');

        } else {
            finishTest.removeClass('show');
            nextStep.addClass('show');
        }
    }
    function clearAllData() {
        currentPage = 1;
        localStorage.clear();
        page4.addClass('nothing-pick');
        userName.val('');
        userEmail.val('');
        userCountry.val('Страна');
        $('.city').val('');
        $('.check-social').removeAttr('checked');
        $('.search.social').val('');
        paginationItems.removeClass('active');
        paginationItems.first().addClass('active');
        $('.img-block').removeClass('animal-active');
    }
    function showErrorMessage(errorSelector) {
        $(errorSelector).show();
    }
    function hideErrorMessage(errorSelector) {
        $(errorSelector).hide();
    }
    function getCitiesOfCountry(country) {
        var citiesOfCountry = [];

        cities.forEach(function (item) {
            if(item.country == country) {
                citiesOfCountry.push(item.name)
            }
        });
        return citiesOfCountry;
    };
    function pageValidation(currentStep){
        var validationResult;

        switch (currentStep) {
            case 1:
                var nameValue = userName.val();
                var emailValue = userEmail.val();
                var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

                validationResult = true;
                if(nameValue.trim() == '') {
                    validationResult = false;
                    showErrorMessage('.error-name')
                } else {
                    hideErrorMessage('.error-name');
                    localStorage.setItem('name', nameValue.trim());
                }
                if(!emailPattern.test(emailValue)) {
                    validationResult = false;
                    showErrorMessage('.error-email')
                } else {
                    hideErrorMessage('.error-email');
                    localStorage.setItem('email', emailValue.trim());
                }
                return validationResult;
                break;
            case 2:
                var country = userCountry.val();
                var countryText = $('.country option[value=' + country + ']').text();
                var city = $('.city').val();
                validationResult = true;

                if(!country || country == 'Страна') {
                    validationResult = false;
                    showErrorMessage('.error-country')
                } else {
                    hideErrorMessage('.error-country');
                    localStorage.setItem('country', countryText);
                }
                if(!city || city == 'Город') {
                    validationResult = false;
                    showErrorMessage('.error-city')
                } else {
                    hideErrorMessage('.error-city');
                    localStorage.setItem('city', city);
                }
                return validationResult;
                break;
            case 3:
                validationResult = true;
                var socialNetworks = $('.check-social:checked').parent();
                var errorNumber = 0;

                hideErrorMessage('.check-block .error');

                for(var i = 0; i < socialNetworks.length; i++) {
                    var facebookValue = $(socialNetworks[i]).find('.search.social.facebook');
                    var twitterValue = $(socialNetworks[i]).find('.search.social.twitter');
                    var odValue = $(socialNetworks[i]).find('.search.social.od');
                    var vkValue = $(socialNetworks[i]).find('.search.social.vk');

                    errorNumber = checkSocialNetwork(facebookValue, 'facebook', errorNumber);
                    errorNumber = checkSocialNetwork(vkValue, 'vk', errorNumber);
                    errorNumber = checkSocialNetwork(odValue, 'od', errorNumber);
                    errorNumber = checkSocialNetwork(twitterValue, 'twitter', errorNumber);
                }
                if(errorNumber > 0) {
                    validationResult = false;
                }

                return validationResult;
                break;
            case 4:
                validationResult = true;
                if(page4.hasClass('inValid') || page4.hasClass('nothing-pick')) {
                    validationResult = false;
                    showErrorMessage('.error-animal')
                } else {
                    hideErrorMessage('.error-animal')
                }

                return validationResult;
                break;
        }
    }
    $('li.next').on('click', function() {
        if(pageValidation(currentPage)) {
            appPages.removeClass('active');
            $('.page[data-num=' + ++currentPage + ']').addClass('active');
            paginationItems.removeClass('active');
            $('.pagination li[data-num=' + currentPage + ']').addClass('available').addClass('active');
            checkLastPageBeforeResult();

        }
    });
    $('.restart').on('click', function() {
        $('.page-result').removeClass('active');
        previousStep.addClass('show');
        nextStep.addClass('show');
        paginationItems.show();

        clearAllData();
        resetPageDisplaying();
    });
    //Click to finish button
    $('.finish-test').on('click', function() {
        if(pageValidation(currentPage)) {
            appPages.removeClass('active');
            $('.page-result').addClass('active');
            paginationItems.hide();
            nextStep.removeClass('show');
            previousStep.removeClass('show');
            $(this).removeClass('show');

            getUsersInfo();
        }
    });

    $('li.previous').on('click', function() {

        if(currentPage - 1 >= 1) {
            appPages.removeClass('active');
            $('.page[data-num=' + --currentPage + ']').addClass('active');
        }
        paginationItems.removeClass('active');
        $('.pagination li[data-num=' + currentPage + ']').addClass('active');
        checkLastPageBeforeResult();
    });

    //select of country

    countrySelect.on('change', function(val) {
        var countryValue = countrySelect.val();
        var citiesOfCountry = getCitiesOfCountry(countryValue);
        $('.city').html('');
        citiesOfCountry.forEach(function(cityValue) {
            $('.city').append('<option value="' + cityValue + '">' + cityValue + '</option>');
        })
    });

    //validation of 4 block
    $('.img-block').on('click', function (ev) {
        $('.img-block').removeClass('animal-active');
        $(this).addClass('animal-active');

        if($(this).attr('data-animal') == 'dog') {
            showErrorMessage('.error-animal');
            page4.addClass('inValid');
        } else {
            hideErrorMessage('.error-animal');
            page4.removeClass('inValid');
            localStorage.setItem('logo-src',$(ev.currentTarget).find('img').attr('src'));
        }
        page4.removeClass('nothing-pick');
    });
    paginationItems.on('click', function(ev) {
       var newActiveBlock = ev.currentTarget.getAttribute('data-num');
       currentPage = Number(newActiveBlock);
       var validatePreviousSteps = true;

       for(var i = 1; i <= newActiveBlock -1; i++) {
           validatePreviousSteps = pageValidation(i);
           if(!validatePreviousSteps) break;
       }
       if(validatePreviousSteps || newActiveBlock == '1') {
           $(this).addClass('available');
           appPages.removeClass('active');
           paginationItems.removeClass('active');
           $('.page[data-num=' + newActiveBlock + ']').addClass('active');
           $(this).addClass('active');
       }
        checkLastPageBeforeResult();
    });
// Start Test
    start();
});
