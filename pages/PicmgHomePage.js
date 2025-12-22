class PicmgHomePage {
  constructor(page) {
    this.page = page;
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' });
    this.memberProductsLink = page.getByRole('link', { name: 'Member Products' });
    this.specificationsLink = page.getByRole('link', { name: 'Specifications' });
    this.newsLink = page.getByRole('link', { name: 'News' });
    this.designWithPicmgLink = page.getByRole('link', { name: 'Design with PICMG' });
    this.getInvolvedLink = page.getByRole('link', { name: 'Get Involved' });
  }

  async goto() {
    await this.page.goto('https://www.picmg.org/');
  }

  async acceptCookies() {
    await this.acceptCookiesButton.click();
  }

  async goToMemberProducts() {
    await this.memberProductsLink.click();
  }

  async goToSpecifications() {
    await this.specificationsLink.click();
  }

  async goToNews() {
    await this.newsLink.click();
  }
}

module.exports = PicmgHomePage;
