(function ($) {
    $.Redactor.prototype.video = function () {
        return {
            reUrlYoutube: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,
            image: '',
            init: function () {
                if (!this.opts.imageManagerJson) 
                    return;
                
                var button = this.button.addAfter('image', 'video', this.lang.get('video'));
                this.button.addCallback(button, this.video.show);
            },
            show: function () {
                this.modal.load('image', this.lang.get('image'), 700);
                this.upload.init('#redactor-modal-image-droparea', this.opts.imageUpload, this.video.upload);
                
                var $modal = this.modal.getModal();
            
                this.modal.createTabber($modal);
                this.modal.addTab(1, this.lang.get('upload'), 'active');
                this.modal.addTab(2, 'Вставка видео');

                $('#redactor-modal-image-droparea').addClass('redactor-tab redactor-tab1');

                var $box2 = $('<section id="redactor-modal-video-insert" class="redactor-tab redactor-tab2"><label>Название видео:</label><input type="text" id="redactor-video-title" aria-label="Название видео" /><label>Youtube Url</label><textarea id="redactor-insert-video-area" style="height: 50px;" placeholder="Формат: https://www.youtube.com/watch?v=B5BVyY6glCQ"></textarea><br><div id="redactor-image-box"></div></section>').hide();
                $modal.append($box2);

                this.selection.save();
                this.modal.show();

                this.modal.createCancelButton();
                var button = this.modal.createActionButton(this.lang.get('insert'));
                button.on('click', this.video.insert);
            },
            upload: function() {
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

                            var img = $('<img src="' + val.thumb + '" rel="' + val.image + '" title="' + thumbtitle + '" data-id="' + id + '" style="width: 100px; height: 75px; cursor: pointer;" />');
                            $('#redactor-image-box').append(img);

                            $('#redactor-image-box').find('img').on("click", function(){
                                if(!$(this).hasClass("act")) { 
                                    $(this).addClass("act");
                                    image = $(this).attr("src");
                                } else {
                                    $(this).removeClass("act");
                                }
                            });
                        }, this));
                    }, this)
                });
            },
            insert: function () {
                var title = $('#redactor-video-title').val(),
                    data = $('#redactor-insert-video-area').val();

                if (!data.match(/<iframe|<video/gi))
                {
                    data = this.clean.stripTags(data);

                    var blockStart = '<div class="article-new__vdblk"><div class="video" id="video-wrapper"><div class="article-new__vdblk_overlay" id="youtube-video-play"></div>',
                        blockTitleStart = '<div class="article-new__vdblk_title">',
                        blockTitleEnd = '</div>',
                        imgStart = '<img class="article-new__vdblk_bg" src="',
                        imgEnd = '" />',
                        iframeStart = '<iframe class="video__iframe" id="video" src="',
                        iframeEnd = '" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>',
                        blockEnd = '</div></div>';

                    if (data.match(this.video.reUrlYoutube))
                    {
                        data = data.replace(this.video.reUrlYoutube, blockStart + blockTitleStart + title + blockTitleEnd + imgStart + image + imgEnd + iframeStart + '//www.youtube.com/embed/$1?enablejsapi=1&html5=1' + iframeEnd + blockEnd);
                    }
                }
    
                this.selection.restore();
                this.modal.close();
    
                var current = this.selection.getBlock() || this.selection.getCurrent();
    
                if (current) $(current).after(data);
                else
                {
                    this.insert.html(data);
                }
    
                this.code.sync(); 
            }
        };
    };
})(jQuery);
