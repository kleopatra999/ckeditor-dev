/*jslint sloppy:true vars:true */
/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview The "colorbutton" plugin that makes it possible to assign
 *               text and background colors to editor contents.
 *
 */
CKEDITOR.plugins.add( 'becolor', {
	requires: 'button,floatpanel',
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'bgcolor,textcolor', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var config = editor.config,
			lang = editor.lang.colorbutton;

		if ( !CKEDITOR.env.hc ) {
			addButton( 'TextColor', 'fore', lang.textColorTitle, 10 );
			//addButton( 'BGColor', 'back', lang.bgColorTitle, 20 );
		}

		function addButton( name, type, title, order ) {
			var colorBoxId = CKEDITOR.tools.getNextId() + '_colorBox';
			editor.ui.add( name, CKEDITOR.UI_BUTTON, {
				label: title,
				title: title,
				modes: { wysiwyg:1 },
				editorFocus: 1,
				toolbar: 'colors,' + order,

				// The automatic colorbox should represent the real color (#6010)
				click: function() {

                    if ( this._.state !== CKEDITOR.TRISTATE_OFF ) { return; }

					var selection = editor.getSelection(),
						block = selection && selection.getStartElement(),
						//path = editor.elementPath( block ),
						color;

					// Find the closest block element.
					//block = path.block || path.blockLimit || editor.document.getBody();

                    color = (block && block.getComputedStyle( 'color' )) || '#ffffff';

                    require('Core/Events').trigger('ckeditor.color', {
                      editor : editor,
                      button : this,
                      color  : color
                    });

					return color;
				}
			});
		}
	}
});

CKEDITOR.plugins.becolor = {
  isUnstylable : function ( ele ) {
    return ( ele.getAttribute( 'contentEditable' ) == 'false' ) || ele.getAttribute( 'data-nostyle' );
  },
  commit : function commit(editor, color, type ) {

    var isUnstylable = CKEDITOR.plugins.becolor.isUnstylable,
        config       = CKEDITOR.config;

    type = type || 'fore';

    editor.focus();

    editor.fire( 'saveSnapshot' );

    // Clean up any conflicting style within the range.
    editor.removeStyle( new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ], { color: 'inherit' } ) );

    if ( color ) {
      var colorStyle = config[ 'colorButton_' + type + 'Style' ];

      colorStyle.childRule = type == 'back' ?
        function( element ) {
        // It's better to apply background color as the innermost style. (#3599)
        // Except for "unstylable elements". (#6103)
        return isUnstylable( element );
      } : function( element ) {
        // Fore color style must be applied inside links instead of around it. (#4772,#6908)
        return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
      };

      editor.applyStyle( new CKEDITOR.style( colorStyle, { color: color } ) );
    }

    editor.fire( 'saveSnapshot' );
  }
};

/**
 * Whether to enable the **More Colors*** button in the color selectors.
 *
 *		config.colorButton_enableMore = false;
 *
 * @cfg {Boolean} [colorButton_enableMore=true]
 * @member CKEDITOR.config
 */

/**
 * Stores the style definition that applies the text foreground color.
 *
 *		// This is actually the default value.
 *		config.colorButton_foreStyle = {
 *			element: 'span',
 *			styles: { color: '#(color)' }
 *		};
 *
 * @cfg [colorButton_foreStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.colorButton_foreStyle = {
	element: 'span',
	styles: { 'color': '#(color)' },
	overrides: [ {
		element: 'font', attributes: { 'color': null }
	}]
};

/**
 * Stores the style definition that applies the text background color.
 *
 *		// This is actually the default value.
 *		config.colorButton_backStyle = {
 *			element: 'span',
 *			styles: { 'background-color': '#(color)' }
 *		};
 *
 * @cfg [colorButton_backStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.colorButton_backStyle = {
	element: 'span',
	styles: { 'background-color': '#(color)' }
};
