<?php
/**
 * Zo2 (http://www.zo2framework.org)
 * A powerful Joomla template framework
 *
 * @link        http://www.zo2framework.org
 * @link        http://github.com/aploss/zo2
 * @author      ZooTemplate <http://zootemplate.com>
 * @copyright   Copyright (c) 2013 APL Solutions (http://apl.vn)
 * @license     GPL v2
 */

defined('_JEXEC') or die;
if (Zo2Framework::isZo2Template()) :
?>

<?php foreach ($this->form->getFieldset('basic') as $field) : ?>
    <div class="control-group">
        <div class="control-label">
            <?php echo $field->label; ?>
        </div>
        <div class="controls">
            <?php echo $field->input; ?>
        </div>
    </div>
<?php endforeach;
else :
    $fieldSets = $this->form->getFieldsets('params');
    $i = 0;
    ?>

    <div class="accordion" id="templatestyleOptions">
    <?php
    foreach ($fieldSets as $name => $fieldSet) :
        $label = !empty($fieldSet->label) ? $fieldSet->label : 'COM_TEMPLATES_'.$name.'_FIELDSET_LABEL';
        $id = 'collapse' . $i++;
        ?>
            <div class="accordion-group">
                <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#templatestyleOptions" href="#<?php echo $id?>">
                        <?php echo JText::_($label)?>
                    </a>
                </div>
                <div id="<?php echo $id?>" class="accordion-body collapse <?php echo $i == 0 ? 'in' : ''?>">
                    <div class="accordion-inner">
                        <?
                        if (isset($fieldSet->description) && trim($fieldSet->description)) :
                            echo '<p class="tip">'.$this->escape(JText::_($fieldSet->description)).'</p>';
                        endif;
                        ?>
                        <?php foreach ($this->form->getFieldset($name) as $field) : ?>
                        <div class="control-group">
                            <div class="control-label">
                                <?php echo $field->label; ?>
                            </div>
                            <div class="controls">
                                <?php echo $field->input; ?>
                            </div>
                        </div>
                    <?php endforeach;?>
                    </div>
                </div>
            </div>
        <?php
    endforeach;
    ?>
    </div>
<?php endif;