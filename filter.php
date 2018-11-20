<?php

class filter_jotted extends moodle_text_filter {

    private static $config = false;
    private static $init = false;

    public function filter( $text, array $options = [] ) {
        /* Don't waste the regex if it's not there */
        if ( strpos( $text, 'jotted' ) === false ) {
            return $text;
        }
        $text = preg_replace_callback( '/{{{\s*?jotted.*?}}}/i', function($matches) {
            return $this->build_html( $matches[ 0 ] );
        }, $text );

        return $text;
    }

    /**
     * Returns the string of HTML used to embed the jotted box
     * @param type $filter_text
     */
    private function build_html( $filter_text ) {
        // Pull out the settings
        $html = $this->get_property( 'html', $filter_text, false );
        $js = $this->get_property( 'js', $filter_text, false );  
        $css = $this->get_property( 'css', $filter_text, false );
        $theme = $this->get_property( 'theme', $filter_text, 'github' );
        $style = $this->get_property( 'style', $filter_text, 'width:100%;height:400px;border:1px solid silver;' );
        $id = $this->get_property( 'id', $filter_text, 'id-' . uniqid() );

        $filtered = '<div id="' . $id . '" class="jotted" data-jotted style="' . $style . '" data-size="14pt"';
        if ( $html !== false ) {
            if ( !$this->is_base64( $html ) ) {
                $html = base64_encode( html_entity_decode( $html ) );
            }
            $filtered .= ' data-html="' . $html . '"';
        }
        if ( $css !== false ) {
            if ( !$this->is_base64( $css ) ) {
                $css = base64_encode( $css );
            }
            $filtered .= ' data-css="' . $css . '"';
        }
        if ( $js !== false ) {
            if ( !$this->is_base64( $js ) ) {
                $js = base64_encode( $js );
            }
            $filtered .= ' data-js="' . $js . '"';
        }
        $filtered .= '></div>';


        return $filtered;
    }

    private function is_base64( $data ) {
        if ( preg_match( '%^[a-zA-Z0-9/+]*={0,2}$%', $data ) ) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Gets a property out of the pulled editr string
     * 
     * @param string $prop Case insensitive property to look for
     * @param string $filter_text The filter text pulled out of content
     * @return string The contents of the property
     */
    private function get_property( $prop, $filter_text, $default = '' ) {
        if ( preg_match( '/' . $prop . '\s?=\s?("|\')(.*?)("|\')/i', $filter_text, $match ) ) {
            if ( isset( $match[ 2 ] ) ) {
                return trim( $match[ 2 ] );
            }
        }
        return $default;
    }

    /**
     * Needed to add the JavaScript and CSS for the plugin
     * 
     * @param type $page
     * @param type $context
     */
    public function setup( $page, $context ) {
        parent::setup( $page, $context );

        if ( empty( $this->config ) ) {
            /* Only load if it's empty */
            $this->config = [
            ];
        }

        if ( empty( $this->init ) ) {
            $page->requires->js( new moodle_url( 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/ace.js' ) );

//            $page->requires->js( new moodle_url( 'https://cdn.jsdelivr.net/npm/jotted@latest/jotted.min.js' ) );
            $page->requires->js( new moodle_url( $CFG->wwwroot . '/filter/jotted/filter_jotted.js' ) );
            // Don't do it again...
            $this->init = true;
        }
    }

}
