/*  ==========================================================================
    Table of Content for Sidebar 1:

    === Function ===
	- runCollapsible

    --------------------------
    === Function Calls ===

    ========================================================================== */


/*  ==========================================================================
    Functions
    ========================================================================== */

/*
    runCollapsible
    ========================================================================== */
    function runCollapsible(accordion){

        $(accordion).collapsible({
            defaultOpen: 'news1',
            speed: 200
        });

    }

/*  ==========================================================================
    Function Calls
   	========================================================================== */

$(function(){

    // Variables
    var collapsible = ".collapsible";

    // === Checkers ===

    // === Setters ===

    // === Executions ===

    runCollapsible(collapsible);

});