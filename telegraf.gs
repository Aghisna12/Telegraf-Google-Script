/*
* Project Name  : Telegraf
* Language Code : Google Script(gs)
* Build Date    : 18/7/2020 08:23 WIB (Sleman,Yogyakarta, Indonesia)
* Last Update   : -
* Author        : @Aghisna12
*###################################################################
* Full Credits  : https://github.com/telegraf/telegraf
* DOCS          : https://telegraf.js.org
*/

class ApiClient {
  constructor(token) {
    this.token = token;
    this.options = {
      apiRoot: 'https://api.telegram.org/bot'
    }
  }
  
  requestApi(method = '', data = {}) {
    var hasil = {
      'method': method
    }
    var options = {
      'method': 'post',
      'payload': data
    }
    var response = UrlFetchApp.fetch(this.options.apiRoot + this.token + '/' + method, options);
    if (response && response.getResponseCode()) {
      hasil['response'] = response.getResponseCode();
      if (response.getContentText()) {
        hasil['data'] = response.getContentText();
      }
    }
    return hasil;
  }
  
  callApi(method, data) {
    if (!this.token) {
      return {
        error_code: 401,
        description: 'Bot Token is required'
      };
    }
    if (!method) {
      return {
        error_code: 401,
        description: 'Method is required'
      }
    }
    var hasil = {
      'method': method
    };
    if (data) {
      hasil = this.requestApi(method, data);
    } else {
      hasil = this.requestApi(method);
    }
    return hasil;
  }
}

class Telegram extends ApiClient {
  //build query
  buildQuery(array) {
    var query = {}
    if (array) {
      for (var index in array) {
        if (array[index]) {
          var value = array[index];
          if (index == 'extra') {
            for (var ix in value) {
              if (value[ix]) {
                query[ix] = value[ix];
              }
            }
          } else {
            if (index == 'chat_id') {
              query[index] = String(value);
            } else {
              query[index] = value;
            }
          }
        }
      }
    }
    return query;
  }
  
  /**
  * Get basic information about the bot
  */
  getMe() {
    return this.callApi('getMe');
  }
  
  /**
  * Get basic info about a file and prepare it for downloading
  * @param fileId Id of file to get link to
  */
  getFile(fileId) {
    return this.callApi('getFile', this.buildQuery({
      file_id: fileId
    }));
  }
  
  /**
  * Get download link to a file
  */
  getFileLink(fileId) {
    var hasil = {
      file_id: fileId
    }
    var file = this.getFile(field);
    if (file) {
      var file_json = JSON.parse(file);
      if (file_json && file_json.file_path) {
        hasil['file_link'] = this.options.apiRoot + '/file/bot' + this.token + '/' + file_json.file_path;
      }
    }
    return hasil;
  }
  
  getUpdates(timeout, limit, offset, allowedUpdates) {
    var url = 'getUpdates?';
    if (offset) {
      url += '&offset=' + offset;
    }
    if (limit) {
      url += '&limit=' + limit;
    }
    if (timeout) {
      url += '&timeout=' + timeout;
    }
    url = url.replace("?&", "?");
    return this.callApi(url, this.buildQuery({
      allowed_updates: allowedUpdates
    }));
  }
  
  getWebhookInfo() {
    return this.callApi('getWebhookInfo');
  }
  
  getGameHighScores(userId, inlineMessageId, chatId, messageId) {
    return this.callApi('getGameHighScores', this.buildQuery({
      user_id: userId,
      inline_message_id: inlineMessageId,
      chat_id: chatId,
      message_id: messageId
    }));
  }
  
  setGameScore(userId, scores, inlineMessageId, chatId, messageId, editMessage = true, isForce) {
    return this.callApi('setGameScore', this.buildQuery({
      force: isForce,
      score: scores,
      user_id: userId,
      inline_message_id: inlineMessageId,
      chat_id: chatId,
      message_id: messageId,
      disable_edit_message: !editMessage
    }));
  }
  
  /**
  * Specify a url to receive incoming updates via an outgoing webhook
  * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration
  * @param certificate Upload your public key certificate so that the root certificate in use can be checked
  * @param maxConnections Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100
  * @param allowedUpdates List the types of updates you want your bot to receive
  */
  setWebhook(urls, certificates, maxConnections = 40, allowedUpdates) {
    return this.callApi('setWebhook', this.buildQuery({
      url: urls,
      certificate: certificates,
      max_connections: maxConnections,
      allowed_updates: allowedUpdates
    }));
  }
  
  deleteWebhook() {
    return this.callApi('deleteWebhook');
  }
  
  /**
  * Send a text message
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param text Text of the message to be sent
  */
  sendMessage(chatId, texts, extras) {
    return this.callApi('sendMessage', this.buildQuery({
      chat_id: chatId,
      text: texts,
      extra: extras
    }));
  }
  
  /**
  * Forward existing message.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param fromChatId Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
  * @param messageId Message identifier in the chat specified in from_chat_id
  */
  forwardMessage(chatId, fromChatId, messageId, extras) {
    return this.callApi('forwardMessage', this.buildQuery({
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      extra: extras
    }));
  }
  
  /**
  * Use this method when you need to tell the user that something is happening on the bot's side.
  * The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendChatAction(chatId, actions) {
    return this.callApi('sendChatAction', this.buildQuery({
      chat_id: chatId,
      action: actions
    }));
  }
  
  getUserProfilePhotos(userId, offset, limit) {
    return this.callApi('getUserProfilePhotos', this.buildQuery({
      user_id: userId,
      offset: offsets,
      limit: limits
    }));
  }
  
  /**
  * Send point on the map
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendLocation(chatId, latitudes, longitudes, extras) {
    return this.callApi('sendLocation', this.buildQuery({
      chat_id: chatId,
      latitude: latitudes,
      longitude: longitudes,
      extra: extras
    }));
  }
  
  sendVenue(chatId, latitudes, longitudes, titles, addresss, extras) {
    return this.callApi('sendVenue', this.buildQuery({
      latitude: latitudes,
      longitude: longitudes,
      title: titles,
      address: addresss,
      chat_id: chatId,
      extra: extras
    }));
  }
  
  /**
  * @param chatId Unique identifier for the target private chat
  */
  sendInvoice(chatId, invoices, extras) {
    return this.callApi('sendInvoice', this.buildQuery({
      chat_id: chatId,
      invoice: invoices,
      extra: extras
    }));
  }
  
  sendContact(chatId, phoneNumber, firstName, extras) {
    return this.callApi('sendContact', this.buildQuery({
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      extra: extras
    }));
  }
  
  /**
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendPhoto(chatId, photos, extras) {
    return this.callApi('sendPhoto', this.buildQuery({
      chat_id: chatId,
      photo: photos,
      extra: extras
    }));
  }
  
  /**
  * Send a dice, which will have a random value from 1 to 6.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendDice(chatId, extras) {
    return this.callApi('sendDice', this.buildQuery({
      chat_id: chatId,
      extra: extras
    }));
  }
  
  /**
  * Send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendDocument(chatId, documents, extras) {
    return this.callApi('sendDocument', this.buildQuery({
      chat_id: chatId,
      document: documents,
      extra: extras
    }));
  }
  
  /**
  * Send audio files, if you want Telegram clients to display them in the music player.
  * Your audio must be in the .mp3 format.
  * Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendAudio(chatId, audios, extras) {
    return this.callApi('sendAudio', this.buildQuery({
      chat_id: chatId,
      audio: audios,
      extra: extras
    }));
  }
  
  /**
  * Send .webp stickers
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendSticker(chatId, stickers, extras) {
    return this.callApi('sendSticker', this.buildQuery({
      chat_id: chatId,
      sticker: sticker,
      extra: extras
    }));
  }
  
  /**
  * Send video files, Telegram clients support mp4 videos (other formats may be sent as Document)
  * Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendVideo(chatId, video, extras) {
    return this.callApi('sendVideo', this.buildQuery({
      chat_id: chatId,
      video: videos,
      extra: extras
    }));
  }
  
  /**
  * Send .gif animations
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendAnimation(chatId, animations, extras) {
    return this.callApi('sendAnimation', this.buildQuery({
      chat_id: chatId,
      animation: animations,
      extra: extras
    }));
  }
  
  /**
  * Send video messages
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendVideoNote(chatId, videoNote, extras) {
    return this.callApi('sendVideoNote', this.buildQuery({
      chat_id: chatId,
      video_note: videoNote,
      extra: extras
    }));
  }
  
  /**
  * Send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  sendVoice(chatId, voices, extras) {
    return this.callApi('sendVoice', this.buildQuery({
      chat_id: chatId,
      voice: voices,
      extra: extras
    }));
  }
  
  /**
  * @param chatId Unique identifier for the target chat
  * @param gameShortName Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
  */
  sendGame(chatId, gameName, extras) {
    return this.callApi('sendGame', this.buildQuery({
      chat_id: chatId,
      game_short_name: gameName,
      extra: extras
    }));
  }
  
  /**
  * Send a group of photos or videos as an album
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
  */
  sendMediaGroup(chatId, medias, extras) {
    return this.callApi('sendMediaGroup', this.buildQuery({
      chat_id: chatId,
      media: medias,
      extra: extras
    }));
  }
  
  /**
  * Send a native poll.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param question Poll question, 1-255 characters
  * @param options A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
  */
  sendPoll(chatId, questions, options, extras) {
    return this.callApi('sendPoll', this.buildQuery({
      chat_id: chatId,
      type: 'regular',
      question: questions,
      options: optionss,
      extra: extras
    }));
  }
  
  /**
  * Send a native quiz.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param question Poll question, 1-255 characters
  * @param options A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
  */
  sendQuiz(chatId, questions, optionss, extras) {
    return this.callApi('sendPoll', this.buildQuery({
      chat_id: chatId,
      type: 'quiz',
      question: questions,
      options: optionss,
      extra: extras
    }));
  }
  
  /**
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param messageId Identifier of the original message with the poll
  */
  stopPoll(chatId, messageId, extras) {
    return this.callApi('stopPoll', this.buildQuery({
      chat_id: chatId,
      message_id: messageId,
      extra: extras
    }));
  }
  
  /**
  * Get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.)
  * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
  */
  getChat(chatId) {
    return this.callApi('getChat', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
  */
  getChatAdministrators(chatId) {
    return this.callApi('getChatAdministrators', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * Get information about a member of a chat.
  * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
  * @param userId Unique identifier of the target user
  */
  getChatMember(chatId, userId) {
    return this.callApi('getChatMember', this.buildQuery({
      chat_id: chatId,
      user_id: userId
    }));
  }
  
  /**
  * Get the number of members in a chat
  * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
  */
  getChatMembersCount(chatId) {
    return this.callApi('getChatMembersCount', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * Send answers to an inline query.
  * No more than 50 results per query are allowed.
  */
  answerInlineQuery(inlineQueryId, results, extras) {
    return this.callApi('answerInlineQuery', this.buildQuery({
      inline_query_id: inlineQueryId,
      results: resultss,
      extra: extras
    }));
  }
  
  setChatPermissions(chatId, permissionss) {
    return this.callApi('setChatPermissions', this.buildQuery({
      chat_id: chatId,
      permissions: permissionss
    }));
  }
  
  /**
  * Kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
  * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
  * @param untilDate Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
  */
  kickChatMember(chatId, userId, untilDate) {
    return this.callApi('kickChatMember', this.buildQuery({
      chat_id: chatId,
      user_id: userId,
      until_date: untilDate
    }));
  }
  
  /**
  * Promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
  */
  promoteChatMember(chatId, userId, extras) {
    return this.callApi('promoteChatMember', this.buildQuery({
      chat_id: chatId,
      user_id: userId,
      extra: extras
    }));
  }
  
  /**
  * Restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all boolean parameters to lift restrictions from a user.
  * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
  */
  restrictChatMember(chatId, userId, extras) {
    return this.callApi('restrictChatMember', this.buildQuery({
      chat_id: chatId,
      user_id: userId,
      extra: extras
    }));
  }
  
  setChatAdministratorCustomTitle(chatId, userId, title) {
    return this.callApi('setChatAdministratorCustomTitle', this.buildQuery({
      chat_id: chatId,
      user_id: userId,
      custom_title: title,
    }));
  }
  
  /**
  * Export an invite link to a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  exportChatInviteLink(chatId) {
    return this.callApi('exportChatInviteLink', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  setChatPhoto(chatId, photos) {
    return this.callApi('setChatPhoto', this.buildQuery({
      chat_id: chatId,
      photo: photos
    }));
  }
  
  deleteChatPhoto(chatId) {
    return this.callApi('deleteChatPhoto', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * Change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
  * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
  * @param title New chat title, 1-255 characters
  */
  setChatTitle(chatId, titles) {
    return this.callApi('setChatTitle', this.buildQuery({
      chat_id: chatId,
      title: titles
    }));
  }
  
  setChatDescription(chatId, descriptions) {
    return this.callApi('setChatDescription', this.buildQuery({
      chat_id: chatId,
      description: descriptions
    }));
  }
  
  /**
  * Pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in the supergroup or 'can_edit_messages' admin right in the channel.
  * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
  */
  pinChatMessage(chatId, messageId, extras) {
    return this.callApi('pinChatMessage', this.buildQuery({
      chat_id: chatId,
      message_id: messageId,
      extra: extras
    }));
  }
  
  /**
  * Unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in the supergroup or 'can_edit_messages' admin right in the channel.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  unpinChatMessage(chatId) {
    return this.callApi('unpinChatMessage', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * Use this method for your bot to leave a group, supergroup or channel
  * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
  */
  leaveChat(chatId) {
    return this.callApi('leaveChat', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  /**
  * Unban a user from a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
  * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format @username)
  * @param userId Unique identifier of the target user
  */
  unbanChatMember(chatId, userId) {
    return this.callApi('unbanChatMember', this.buildQuery({
      chat_id: chatId,
      user_id: userId
    }));
  }
  
  answerCbQuery(callbackQueryId, texts, showAlert, extras) {
    return this.callApi('answerCallbackQuery', this.buildQuery({
      text: texts,
      show_alert: showAlert,
      callback_query_id: callbackQueryId,
      extra: extras
    }));
  }
  
  answerGameQuery(callbackQueryId, urls) {
    return this.callApi('answerCallbackQuery', this.buildQuery({
      url: urls,
      callback_query_id: callbackQueryId
    }));
  }
  
  /**
  * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified,
  * the Bot API will send an Update with a shipping_query field to the bot.
  * Reply to shipping queries.
  * @param ok  Specify True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
  * @param shippingOptions Required if ok is True. A JSON-serialized array of available shipping options.
  * @param errorMessage Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user.
  */
  answerShippingQuery(shippingQueryId, oks, shippingOptions, errorMessage) {
    return this.callApi('answerShippingQuery', this.buildQuery({
      ok: oks,
      shipping_query_id: shippingQueryId,
      shipping_options: shippingOptions,
      error_message: errorMessage
    }));
  }
  
  /**
  * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query.
  * Respond to such pre-checkout queries. On success, True is returned.
  * Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
  * @param ok  Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
  * @param errorMessage Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
  */
  answerPreCheckoutQuery(preCheckoutQueryId, oks, errorMessage) {
    return this.callApi('answerPreCheckoutQuery', this.buildQuery({
      ok: oks,
      pre_checkout_query_id: preCheckoutQueryId,
      error_message: errorMessage
    }));
  }
  
  /**
  * Edit text and game messages sent by the bot or via the bot (for inline bots).
  * On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
  * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
  * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
  * @param text New text of the message
  */
  editMessageText(chatId, messageId, inlineMessageId, texts, extras) {
    return this.callApi('editMessageText', this.buildQuery({
      text:texts,
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      extra: extras
    }));
  }
  
  /**
  * Edit captions of messages sent by the bot or via the bot (for inline bots).
  * On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
  * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
  * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
  * @param caption New caption of the message
  * @param markup A JSON-serialized object for an inline keyboard.
  */
  editMessageCaption(chatId, messageId, inlineMessageId, captions, parse_modes) {
    return this.callApi('editMessageCaption', this.buildQuery({
      caption: captions,
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      parse_mode: parse_modes // prettier-ignore   reply_markup: extra.parse_mode || extra.reply_markup ? extra.reply_markup : extra }));
    }));
  }
  
  /**
  * Edit animation, audio, document, photo, or video messages.
  * If a message is a part of a message album, then it can be edited only to a photo or a video.
  * Otherwise, message type can be changed arbitrarily.
  * When inline message is edited, new file can't be uploaded.
  * Use previously uploaded file via its file_id or specify a URL.
  * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
  * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
  * @param media New media of message
  * @param markup Markup of inline keyboard
  */
  editMessageMedia(chatId, messageId, inlineMessageId, medias, extras, reply_markups) {
    return this.callApi('editMessageMedia', this.buildQuery({
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      media: medias,
      reply_markup: reply_markups
    }));
  }
  
  /**
  * Edit only the reply markup of messages sent by the bot or via the bot (for inline bots).
  * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
  * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
  * @param markup A JSON-serialized object for an inline keyboard.
  * @returns If edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
  */
  editMessageReplyMarkup(chatId, messageId, inlineMessageId, markups) {
    return this.callApi('editMessageReplyMarkup', this.buildQuery({
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markups
    }));
  }
  
  // FIXME: parameter order inconsistent with other edit* methods
  editMessageLiveLocation(latitudes, longitudes, chatId, messageId, inlineMessageId, markups) {
    return this.callApi('editMessageLiveLocation', this.buildQuery({
      latitude: latitudes,
      longitude: longitudes,
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markups
    }));
  }
  
  stopMessageLiveLocation(chatId, messageId, inlineMessageId, markups) {
    return this.callApi('stopMessageLiveLocation', this.buildQuery({
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markups
    }));
  }
  
  /**
  * Delete a message, including service messages, with the following limitations:
  * - A message can only be deleted if it was sent less than 48 hours ago.
  * - Bots can delete outgoing messages in groups and supergroups.
  * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
  * - If the bot is an administrator of a group, it can delete any message there.
  * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
  * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
  */
  deleteMessage(chatId, messageId) {
    return this.callApi('deleteMessage', this.buildQuery({
      chat_id: chatId,
      message_id: messageId
    }));
  }
  
  setChatStickerSet(chatId, setName) {
    return this.callApi('setChatStickerSet', this.buildQuery({
      chat_id: chatId,
      sticker_set_name: setName
    }));
  }
  
  deleteChatStickerSet(chatId) {
    return this.callApi('deleteChatStickerSet', this.buildQuery({
      chat_id: chatId
    }));
  }
  
  getStickerSet(names) {
    return this.callApi('getStickerSet', this.buildQuery({
      name: names
    }));
  }
  
  /**
  * Upload a .png file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times)
  * https://core.telegram.org/bots/api#sending-files
  * @param ownerId User identifier of sticker file owner
  * @param stickerFile Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px.
  */
  uploadStickerFile(ownerId, stickerFile) {
    return this.callApi('uploadStickerFile', this.buildQuery({
      user_id: ownerId,
      png_sticker: stickerFile
    }));
  }
  
  /**
  * Create new sticker set owned by a user. The bot will be able to edit the created sticker set
  * @param ownerId User identifier of created sticker set owner
  * @param name Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in “_by_<bot username>”. <bot_username> is case insensitive. 1-64 characters.
  * @param title Sticker set title, 1-64 characters
  */
  createNewStickerSet(ownerId, names, titles, stickerDatas) {
    return this.callApi('createNewStickerSet', this.buildQuery({
      name: names,
      title: titles,
      user_id: ownerId,
      stickerData: stickerDatas
    }));
  }
  
  /**
  * Add a new sticker to a set created by the bot
  * @param ownerId User identifier of sticker set owner
  * @param name Sticker set name
  */
  addStickerToSet(ownerId, names, stickerDatas, isMasks) {
    return this.callApi('addStickerToSet', this.buildQuery({
      name: names,
      user_id: ownerId,
      is_masks: isMasks,
      stickerData: stickerDatas
    }));
  }
  
  /**
  * Move a sticker in a set created by the bot to a specific position
  * @param sticker File identifier of the sticker
  * @param position New sticker position in the set, zero-based
  */
  setStickerPositionInSet(stickers, positions) {
    return this.callApi('setStickerPositionInSet', this.buildQuery({
      sticker: stickers,
      position: positions
    }));
  }
  
  setStickerSetThumb(names, userId, thumbs) {
    return this.callApi('setStickerSetThumb', this.buildQuery({
      name: names,
      user_id: userId,
      thumb: thumbs
    }));
  }
  
  /**
  * Delete a sticker from a set created by the bot.
  * @param sticker File identifier of the sticker
  */
  deleteStickerFromSet(stickers) {
    return this.callApi('deleteStickerFromSet', this.buildQuery({
      sticker: stickers
    }));
  }
  
  /**
  * Get the current list of the bot's commands.
  */
  getMyCommands() {
    return this.callApi('getMyCommands');
  }
  
  /**
  * Change the list of the bot's commands.
  * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
  */
  setMyCommands(commandss) {
    return this.callApi('setMyCommands', this.buildQuery({
      commands: commandss
    }));
  }
  
  setPassportDataErrors(userId, errors) {
    return this.callApi('setPassportDataErrors', this.buildQuery({
      user_id: userId,
      errors: errors
    }));
  }
}
