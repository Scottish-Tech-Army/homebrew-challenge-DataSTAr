import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class dashboardPage extends Page {
    
    get imgLogo () { return $('img[id="logo"]') }
    get headingTitle () { return $('[class="heading heading-title"] ') }
    get currentPhase () { return $('[class="current-phase col-12"] ') }
    get healthBoard () { return $('#healthBoards')} 
    get councilAreas () { return $('#councilAreas')} 
    get cases () { return $('#cases')}
    get deaths () { return $('#deaths')} 
    get dailyCases () { return $('#dailyCases')} 
    get totalCases () { return $('#totalCases')} 
    get dailyDeaths () { return $('#dailyDeaths')}
    get totalDeaths () { return $('#totalDeaths')}
    get percentageCases () { return $('#percentageCases')}   
    
    open () {
        return super.open();
    }
}

export default new dashboardPage();