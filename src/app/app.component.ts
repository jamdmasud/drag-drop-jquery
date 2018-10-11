import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import {HttpService} from '../app/services/http.service';
import { ObjectDesign } from './models/objectDesign';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'drag-drop-jquery';
  public ExistingData = [{Title: 'Training Batch', Id: 1}];
  public badge = 'badge-secondary';
  public Mode = 'Save';
  public bg = 'bg-success';
  public avatar = 'O3ENJ59Avatar page 1.JPG';
  public textColor = 'text-white';
  public button = 'Button';
  public paragraph = 'Paragraph';
  public objectDesighn: ObjectDesign;

  constructor(private http: HttpService) {

  }

  ngOnInit(): void {
    this.addJquery();
  }

getContainer() {
    // you'll get your through 'elements' below code
    localStorage.setItem('DragDrop', $('#container').html());
}

Save(): void {
    const desData = $('#container').html();
    localStorage.setItem('DragDrop', desData);
    this.objectDesighn.title = this.title;
    this.objectDesighn.designData =  desData;
    this.http.save(this.objectDesighn).subscribe(json => {
        this.objectDesighn.id = json.id;
        this.objectDesighn.candidateId = json.candidateId;
        this.objectDesighn.designData = json.designData;
        this.objectDesighn.title = json.title;
    });
}

getService(): void {
    this.http.getObjectDesign(17).subscribe(json => {
        // console.log(this.objectDesighn.designData);
        this.objectDesighn = json;
        console.log(json);
        $('#container').html(json.DesignData);
        this.addJquery();
    });

}

changeBackgroundColor(color: string) {
    this.bg = color;
}

changeTextColor(color: string) {
    this.textColor = color;
}

addJquery(): void {
 $(document).ready(function() {

  let zindex = 1;

  // $("#container").html(div);
  function initDraggable(c) {
      $(c).draggable({
          containment: '#container',
          cursor: 'move',
      });
      $(c).resizable({ handles: 'e, w, n, s' });
  }

  initDraggable($('.canvas-element'));

  $('.realobject, .btnObj').draggable({
      helper: 'clone',
      cursor: 'move',
      revert: true,
      start: function (event, ui) {
        $(this).addClass('ui-draggable-dragging');
      },
      stop: function (event, ui) {
          $(this).removeClass('ui-draggable-dragging');
      }
  });
 

  $('#container').droppable({
    drop: function (event, ui) {
        initDraggable($('.canvas-element'));
        const $canvas = $(this);
        if (!ui.draggable.hasClass('canvas-element')) {
            const $canvasElement = ui.draggable.clone();
            $canvasElement.addClass('canvas-element');
            $canvasElement.removeClass('ui-draggable-dragging');
            $canvasElement.draggable({
                // start: function(event, ui) { $(this).css("z-index", a++); },
                containment: '#container',
                cursor: 'move'
            });
            if (!ui.draggable.hasClass('btnObj')) {
                $canvasElement.resizable({
                    handles: 'e, w, n, s',
                    resize: function (event, ui) {
                        $(this).css('height', 'width');
                    }
                });
            }

            $canvas.append($canvasElement);
            $canvasElement.css({
                left: (ui.offset.left - $(this).offset().left),
                top: (ui.offset.top - $(this).offset().top),
                position: 'absolute',
                'z-index': ui.draggable.hasClass('realobject') ? 0 : zindex,
                margin: '0 auto'
            });
            if ($canvasElement.hasClass('trigger')) {
                $canvasElement.attr('data-bind', Math.random().toString(36).substring(7));
            }
        }
    }
  });

  $(document).on('focusout', function(e) {
      const id = e.target.id;
      if (id === 'inp') {
        const val = $('#inp').val();
        const v = document.getElementById('inp');
        $('.ui-selected p').text(val);
        $('#inp').remove();
      }
  });

  $(document).on('dblclick', '.realobject', function (e) {
        $('#inp').remove();
        const input = $('<input type="text" id="inp" style="position:absolute;top:10px;left:0;z-index:1000" />');
        $('.ui-selected p').append(input);
    // console.log(position.x, position.y);
  });

  function rPosition(mouseX, mouseY) {
    const offs = $('#container').offset();
    const x = mouseX - offs.left;
    const y = mouseY - offs.top;
    return {'x': x, 'y': y};
   }

  $(document).on('click', '.resize_box', function () {

    $(this).css('z-index', zindex++);
    if ($(this).hasClass('ui-selected')) {
        $(this).removeClass('ui-selected');
    } else {
        $(this).addClass('ui-selected');
    }
  });

  $(document).on('click', '.realobject, .btnObj', function (evt) {
    const imgName = $(this).find('img').attr('src');
    $('#container').css({'background-image' : 'url(' + imgName + ')', 'background-repeat': 'no-repeat', 'background-size': 'cover' });

    if ($(this).hasClass('ui-selected')) {
        setTimeout(function() {
            $(this).removeClass('ui-selected');
            if (!evt.ctrlKey) {
                if ($(this).data('bind') !== undefined) {
                    $('.' + $(this).data('bind')).css({ 'visibility': 'visible' });
                }
            }
        }, 250);
    } else {
        $(this).addClass('ui-selected');
        if (!evt.ctrlKey) {
            if ($(this).data('bind') !== undefined) {
                $('.' + $(this).data('bind')).css({ 'visibility': 'hidden' });
            }
        }
    }
});

  $(document).keyup(function (e) {
    if (e.keyCode === 46) {
        $('#container > div').remove('.ui-selected');
    }
  });

  let isOnDiv = false;
  $('#container').mouseenter(function () { isOnDiv = true; });
  $('#container').mouseleave(function () { isOnDiv = false; });
  $(document).keydown(function (objEvent) {
      if (objEvent.ctrlKey) {
          if (objEvent.keyCode === 65 && isOnDiv) {
              $('#container > div').addClass('ui-selected');
              return false;
          }
      }
  });

  const selected = $([]), offset = { top: 0, left: 0 };
  $('#container').selectable({
      filter: 'div'
  });


  $(document).keydown(function (e) {
    const div = $('div.resize_box.ui-selected,div.realobject.ui-selected,div.btnObj.ui-selected');
        // console.log(div);
        // alert(e.which);
        switch (e.which) {
            case 37:
                e.preventDefault();
                $(div).stop().animate({
                    left: '-=20'
                }); // left arrow key
                break;
            case 38:
                e.preventDefault();
                $(div).stop().animate({
                    top: '-=20'
                }); // up arrow key
                break;
            case 39:
                e.preventDefault();
                $(div).stop().animate({
                    left: '+=20'
                }); // right arrow key
                break;
            case 40:
                e.preventDefault();
                $(div).stop().animate({
                    top: '+=20'
                }); // bottom arrow key
                break;
            case 45:
                e.preventDefault();
                $( '#dialog' ).dialog({
                    draggable: true,
                    open: function(evt, ui) {
                        $('.richText-editor').html($('.ui-selected p').html());
                    },
                    close: function( event, ui ) {
                        const html = $('.richText-editor').html();
                        $('.ui-selected p').html(html);
                    }
                });
                // $('#inp').remove();
                // const input = $('<input type="text" id="inp" style="position:absolute;top:10px;left:0;z-index:1000" />');
                // $('.ui-selected p').append(input);
                break;
            case 13:
                e.preventDefault();
                let group = '';
                $('.ui-selected').each(function (i, obj) {
                    if ($(this).data('bind') !== undefined) {
                        group = $(this).data('bind');
                    }
                });
                $('.' + group).removeClass(group);
                $('.ui-selected').each(function (i, obj) {
                    if ($(this).data('bind') === undefined) {
                        $(this).addClass(group);

                    }
                });
                break;
        }
  });


  $('#btnSave').click(function () {
    localStorage.setItem('DragDrop', $('#container').html());
  });


  $('#btnGet').click(function () {
    // e.preventDefault();
    // $('.resize_box').draggable('destroy');
    $('#container').html(localStorage.getItem('DragDrop'));
    initDraggable($('.canvas-element'));
    $('.canvas-element').resizable({
        handles: 'e, w, n, s'
    });
    $('#container > .Digital8').css('opacity', .4);

  });

    });

    // $('.editor').richText(); 

    $('.editor').richText({
        // text formatting
        bold: true,
        italic: true,
        underline: true,

        // text alignment
        leftAlign: true,
        centerAlign: true,
        rightAlign: true,

        // lists
        ol: true,
        ul: true,

        // title
        heading: true,

        // fonts
        fonts: true,
        fontList: ['Arial',
          'Arial Black',
          'Comic Sans MS',
          'Courier New',
          'Geneva',
          'Georgia',
          'Helvetica',
          'Impact',
          'Lucida Console',
          'Tahoma',
          'Times New Roman',
          'Verdana'
          ],
        fontColor: true,
        fontSize: true,

        // uploads
        imageUpload: true,
        fileUpload: true,

        // link
        urls: true,

        // tables
        table: true,

        // code
        removeStyles: true,
        code: true,

        // colors
        colors: [],

        // dropdowns
        fileHTML: '',
        imageHTML: '',

        // translations
        translations: {
          'title': 'Title',
          'white': 'White',
          'black': 'Black',
          'brown': 'Brown',
          'beige': 'Beige',
          'darkBlue': 'Dark Blue',
          'blue': 'Blue',
          'lightBlue': 'Light Blue',
          'darkRed': 'Dark Red',
          'red': 'Red',
          'darkGreen': 'Dark Green',
          'green': 'Green',
          'purple': 'Purple',
          'darkTurquois': 'Dark Turquois',
          'turquois': 'Turquois',
          'darkOrange': 'Dark Orange',
          'orange': 'Orange',
          'yellow': 'Yellow',
          'imageURL': 'Image URL',
          'fileURL': 'File URL',
          'linkText': 'Link text',
          'url': 'URL',
          'size': 'Size',
          'responsive': '<a href="https://www.jqueryscript.net/tags.php?/Responsive/">Responsive</a>',
          'text': 'Text',
          'openIn': 'Open in',
          'sameTab': 'Same tab',
          'newTab': 'New tab',
          'align': 'Align',
          'left': 'Left',
          'center': 'Center',
          'right': 'Right',
          'rows': 'Rows',
          'columns': 'Columns',
          'add': 'Add',
          'pleaseEnterURL': 'Please enter an URL',
          'videoURLnotSupported': 'Video URL not supported',
          'pleaseSelectImage': 'Please select an image',
          'pleaseSelectFile': 'Please select a file',
          'bold': 'Bold',
          'italic': 'Italic',
          'underline': 'Underline',
          'alignLeft': 'Align left',
          'alignCenter': 'Align centered',
          'alignRight': 'Align right',
          'addOrderedList': 'Add ordered list',
          'addUnorderedList': 'Add unordered list',
          'addHeading': 'Add Heading/title',
          'addFont': 'Add font',
          'addFontColor': 'Add font color',
          'addFontSize' : 'Add font size',
          'addImage': 'Add image',
          'addVideo': 'Add video',
          'addFile': 'Add file',
          'addURL': 'Add URL',
          'addTable': 'Add table',
          'removeStyles': 'Remove styles',
          'code': 'Show HTML code',
          'undo': 'Undo',
          'redo': 'Redo',
          'close': 'Close'
        },
        useSingleQuotes: false,
        height: 0,
        heightPercentage: 0,
        id: '',
        class: '',
        useParagraph: false
      });
}

}
