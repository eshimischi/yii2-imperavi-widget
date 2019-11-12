(function ($) {
    $.Redactor.prototype.video = function () {
        return {
            reUrlYoutube: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,
            getTemplate: function () {
                return String()
                    + '<section id="redactor-modal-video-insert" class="redactor-tab redactor-tab2">'
                    + '<label>Название видео:</label>'
                    + '<input type="text" id="redaktor-video-title" aria-label="Название видео" />'
                    + '<label>Youtube Url</label>'
                    + '<textarea id="redactor-insert-video-area" style="height: 160px;" placeholder="Формат: https://www.youtube.com/watch?v=B5BVyY6glCQ"></textarea>'
                    + '<div id="redactor-image-box"></div>'
                    + '</section>';
            },
            init: function () {
                if (!this.opts.imageManagerJson) 
                    return;
                
                var button = this.button.addAfter('image', 'video', this.lang.get('video'));
                this.button.addCallback(button, this.video.show);
            },
            show: function () {
                var $modal = this.modal.getModal();
            
                this.modal.createTabber($modal);
                this.modal.addTab(1, this.lang.get('upload'), 'active');
                this.modal.addTab(2, 'Вставка видео');

                $('#redactor-modal-image-droparea').addClass('redactor-tab redactor-tab1');

                //var $box2 = $('<div id="redactor-image-manager-box" style="overflow: auto; height: 300px;" class="redactor-tab redactor-tab2">').hide();
                //$modal.append($box2);
                this.modal.addTemplate('video', this.video.getTemplate());

                $.ajax({
                    dataType: "json",
                    cache: false,
                    url: this.opts.imageManagerJson,
                    success: $.proxy(function (data) {
                        $.each(data, $.proxy(function (key, val) {
                            // title
                            var thumbtitle = '';
                            if (typeof val.title !== 'undefined') thumbtitle = val.title;
                            var id = '';
                            if (typeof val.id !== 'undefined') id = val.id;

                            this.modal.load('video', this.lang.get('video'), 700);
                            this.modal.createCancelButton();

                            var button = this.modal.createActionButton(this.lang.get('insert'));
                            button.on('click', this.video.insert);

                            var img = $('<img src="' + val.thumb + '" rel="' + val.image + '" title="' + thumbtitle + '" data-id="' + id + '" style="width: 100px; height: 75px; cursor: pointer;" />');
                            $('#redactor-image-box').append(img);

                            this.selection.save();
                            this.modal.show();

                            $('#redactor-insert-video-area').focus();

                        }, this));
                    }, this)
                });
            },
            insert: function () {}
        };
    };
})(jQuery);
