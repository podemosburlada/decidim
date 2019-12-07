/**
 * Makes the #select-identity-button to open a popup for the user to
 * select with which identity he wants to perform an action.
 *
 */
$(document).ready(function () {

  let button = $("#select-identity-button"),
      identities_url = null,
      userIdentitiesDialog = $("#user-identities");

  if (userIdentitiesDialog.length) {
    identities_url = userIdentitiesDialog.data("reveal-identities-url");

    button.click(function () {
      $.ajax(identities_url).done(function(response) {
        userIdentitiesDialog.html(response).foundation("open");
        button.trigger("ajax:success")
      });
    });
  }
});


/**
 * Manage the identity selector for endorsements.
 *
 */
$(document).ready(function () {
  $("#select-identity-button").on("ajax:success", function() {
    // once reveal popup has been rendered register event callbacks
    $("#user-identities ul.reveal__list li").each(function(index, elem) {
      let liTag = $(elem)
      liTag.on("click", function() {
        let method = liTag.data("method")
        $.ajax({
          url: liTag.data((method == "POST") ? "create_url" : "destroy_url"),
          method: method,
          dataType: "script",
          success: function() {
            if (liTag.hasClass("selected")) {
              liTag.removeClass("selected")
              liTag.find(".icon--circle-check").addClass("invisible")
              liTag.data("method", "POST")
            } else {
              liTag.addClass("selected")
              liTag.find(".icon--circle-check").removeClass("invisible")
              liTag.data("method", "DELETE")
            }
          }
        })
      })
    });
  });
})