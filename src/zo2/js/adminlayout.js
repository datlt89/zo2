var strategy = [
    [12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [3, 3, 2, 2, 2], [2, 2, 2, 2, 2, 2]
];
jQuery(document).ready(function($){
    var width = $('#style-form').width() - 320;
    $('#droppable-container').css('width', width);
    var layoutName = $('#hfLayoutName').val();
    var templateName = $('#hfTemplateName').val();

    $('#btSaveLayout').on('click', function() {
        var json = generateJson();
        var postData = {
            zo2controller: 'saveLayout',
            name: layoutName,
            template: templateName,
            data: json
        };
        $.post('index.php', postData, function(res) {
        });
        return false;
    });

    loadLayout($('#hfTemplateName').val(), $('#hfLayoutName').val());

    $('.row-control-icon.duplicate').live('click', function() {
        var $this = $(this);
        var $parent = $this.closest('.row-fluid');
        var $container = $this.closest('.container-fluid, .sortable-span');
        var $row = jQuery('<div />').addClass('row-fluid sortable-row').insertAfter($parent);
        $row.attr('data-zo2-type', 'row');
        $row.attr('data-zo2-customClass', '');
        var $meta = jQuery('<div class="span12 row-control"><div class="row-control-container"><div class="row-name">(unnamed row)' +
            '</div><div class="row-control-buttons"><div class="row-control-icon dragger"></div><div class="row-control-icon settings"></div><div class="row-control-icon delete"></div><div class="row-control-icon duplicate"></div><div class="row-control-icon split"></div></div></div></div>');
        $meta.appendTo($row);
        jQuery('<hr />').appendTo($row);
        //var $span12 = jQuery('<div />').addClass('span12').appendTo($row);
        var $colContainer = jQuery('<div />').addClass('col-container row-fluid clearfix');
        $colContainer.appendTo($meta);
    });

    $('.row-control-icon.split').live('click', function() {
        var $this = $(this);
        var $container = $this.closest('[data-zo2-type="row"]');
        var $colContainer = $container.find('>.span12>.col-container');
        var $spans = $colContainer.find('>[data-zo2-type="span"]');
        var strategyNum = $spans.length;

        if ($spans.length > 6) return false;
        else
        {
            var selectedStrategy = strategy[strategyNum];
            var $span = jQuery('<div />').addClass('sortable-span');
            $span.attr('data-zo2-type', 'span');
            $span.attr('data-zo2-position', '');
            var $meta = jQuery('<div class="col-name">(none)</div><div class="col-control-buttons"><div class="col-control-icon dragger"></div><div class="col-control-icon delete"></div><div class="col-control-icon delete"></div></div></div>');
            $meta.appendTo($span);
            var $spanContainer = jQuery('<div />').addClass('row-container row-fluid sortable-row');
            $spanContainer.appendTo($span);
            $span.appendTo($colContainer);

            // apply new span number
            $colContainer.find('>[data-zo2-type="span"]').each(function(index) {
                var $this = jQuery(this);
                $this.removeClass('span1 span2 span3 span4 span5 span6 span7 span8 span9 span10 span11 span12');
                $this.addClass('span' + selectedStrategy[index]);
                $this.attr('data-zo2-span', selectedStrategy[index]);
            });
        }
    });

    $('.row-control-buttons .delete').live('click', function(){
        var $this = $(this);
        if (confirm('Are you sure want to delete this row?')) {
            $this.closest('.sortable-row').remove();
        }
    });

    $('.col-control-buttons .delete').live('click', function() {
        var $this = $(this);

        if(confirm('Are you sure want to delete this column?')) {
            $this.closest('.sortable-span').remove();
        }
    });

    $('.row-control-buttons .settings').live('click', function(){
        var $this = $(this);
        var $row = $this.closest('.sortable-row');
        var rowName = $row.find('>.row-control>.row-control-container>.row-name').text();
        var rowCustomClass = $row.attr('data-zo2-customClass');
        if (!rowCustomClass) rowCustomClass = '';
        $.data(document.body, 'editingEl', $row);
        $('#txtRowName').val('').val(rowName);
        $('#txtRowCss').val('').val(rowCustomClass);
        $('#rowSettingsModal').modal('show');
    });

    $('#btnSaveRowSettings').live('click', function () {
        var $row = $.data(document.body, 'editingEl');
        $row.find('>.row-control>.row-control-container>.row-name').text($('#txtRowName').val());
        $row.attr('data-zo2-customClass', $('#txtRowCss').val());
        $('#rowSettingsModal').modal('hide');
        return false;
    });
});

var bindSortable = function () {
    jQuery('#droppable-container > .container-fluid').sortable({
        items: '>.sortable-row',
        handle: '>.row-control>.row-control-container>.row-control-buttons>.row-control-icon.dragger',
        containment: 'parent',
        tolerance: "pointer",
        axis: 'y'

    });

    jQuery('.sortable-row').sortable({
        items: '.sortable-span',
        connectWith: '>.sortable-row',
        handle: '>.col-control-buttons>.col-control-icon.dragger',
        containment: 'parent',
        tolerance: "pointer",
        helper: 'clone',
        axis: 'x'
    });
};

// jQuery('#hfTemplateName').val()
var loadLayout = function (templateName, layoutName) {
    jQuery.getJSON('index.php?zo2controller=getLayout&layout=' + layoutName + '&template=' + templateName, function(data){
        var $rootParent = jQuery('#droppable-container .container-fluid');
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.type == 'row') insertRow(item, $rootParent);
            else if(item.type == 'col') insertCol(item, $rootParent);
        }

        bindSortable();
    });
};

var insertRow = function (row, $parent) {
    var $row = jQuery('<div />').addClass('row-fluid sortable-row').appendTo($parent);
    $row.attr('data-zo2-type', 'row');
    $row.attr('data-zo2-customClass', row.customClass);
    var $meta = jQuery('<div class="span12 row-control"><div class="row-control-container"><div class="row-name">' + row.name +
        '</div><div class="row-control-buttons"><div class="row-control-icon dragger"></div><div class="row-control-icon settings"></div><div class="row-control-icon delete"></div><div class="row-control-icon duplicate"></div><div class="row-control-icon split"></div></div></div></div>');
    $meta.appendTo($row);
    jQuery('<hr />').appendTo($row);
    //var $span12 = jQuery('<div />').addClass('span12').appendTo($row);
    var $colContainer = jQuery('<div />').addClass('col-container row-fluid clearfix');
    $colContainer.appendTo($meta);

    for (var i = 0; i < row.children.length; i++) {
        var item = row.children[i];
        if (item.type == 'row') insertRow(item, $colContainer);
        else if(item.type == 'col') insertCol(item, $colContainer);
    }
};

var insertCol = function(span, $parent) {
    var $span = jQuery('<div />').addClass('sortable-span').addClass('span'+ span.span).appendTo($parent);
    $span.attr('data-zo2-type', 'span').attr('data-zo2-span', span.span);
    $span.attr('data-zo2-position', span.position);
    var $meta = jQuery('<div class="col-name">' + span.name +
        '</div><div class="col-control-buttons"><div class="col-control-icon dragger"></div><div class="col-control-icon settings"></div><div class="col-control-icon delete"></div></div>');
    $meta.appendTo($span);
    var $spanContainer = jQuery('<div />').addClass('row-container row-fluid sortable-row');
    $spanContainer.appendTo($span);

    for (var i = 0; i < span.children.length; i++) {
        var item = span.children[i];

        if (item.type == 'row') insertRow(item, $spanContainer);
        else if(item.type == 'col') insertCol(item, $spanContainer);
    }
};

var generateJson = function() {
    var $rootParent = jQuery('#droppable-container .container-fluid');
    var json = [];
    $rootParent.find('>[data-zo2-type="row"]').each(function (){
        var itemJson = generateItemJson(jQuery(this));
        if (itemJson != null) json.push(itemJson);
    });

    return JSON.stringify(json);
};

var generateItemJson = function($item) {
    var result = null;
    var $childrenContainer = null;
    if ($item.attr('data-zo2-type') == 'row') {
        result = {
            type: "row",
            name: $item.find('> .row-control > .row-control-container > .row-name').text(),
            customClass: "",
            children: []
        };

        $childrenContainer = $item.find('> .row-control > .row-fluid');

        $childrenContainer.find('> [data-zo2-type]').each(function() {
            var childItem = generateItemJson(jQuery(this));
            result.children.push(childItem);
        });
    }
    else if ($item.attr('data-zo2-type') == 'span') {
        result = {
            type: "col",
            name: $item.find('> .col-name').text(),
            position: $item.attr('data-zo2-position'),
            span: parseInt($item.attr('data-zo2-span')),
            customClass: "",
            children: []
        };

        $childrenContainer = $item.find('> .row-fluid');

        $childrenContainer.find('> [data-zo2-type]').each(function() {
            var childItem = generateItemJson(jQuery(this));
            result.children.push(childItem);
        });
    }

    return result;
};

var rearrangeSpan = function ($container){
    var $ = jQuery;
    var $spans = $container.find('>[data-zo2-type="span"]');
    var strategyNum = $spans.length;
    if (strategyNum > strategy.length - 1) return false;
    else
    {
        var selectedStrategy = strategy[strategyNum];
        $container.find('>[data-zo2-type="span"]').each(function(index) {
            var $this = jQuery(this);
            $this.removeClass('span1 span2 span3 span4 span5 span6 span7 span8 span9 span10 span11 span12');
            $this.addClass('span' + selectedStrategy[index]);
            $this.attr('data-zo2-span', selectedStrategy[index]);
        });
    }
};