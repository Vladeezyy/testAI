import { ProductInfo } from '../pages/AdvancedMC/BoardBotPage';

export interface TestReport {
  prompt: string;
  totalResults: number;
  suitableProducts: number;
  unsuitableProducts: number;
  originalProduct: number;  // Index of original product (if found), -1 if not found
  products: ProductInfo[];
  warnings: string[];
}

export class ReportGenerator {
  static generateReport(
    prompt: string,
    products: ProductInfo[],
    expectedCategory: string = 'AdvancedMC',
    originalProductUrl?: string
  ): TestReport {
    const warnings: string[] = [];
    let suitableCount = 0;
    let unsuitableCount = 0;
    let originalProductIndex = -1;

    // Check each product's category and if it's the original product
    products.forEach((product, index) => {
      const categoryLower = product.category.toLowerCase();
      const expectedLower = expectedCategory.toLowerCase();

      if (categoryLower.includes(expectedLower)) {
        suitableCount++;
      } else {
        unsuitableCount++;
        warnings.push(
          `⚠️ WARNING: Product #${index + 1} "${product.productName}" has category "${product.category}" (Expected: ${expectedCategory})`
        );
      }
      
      // Check if this is the original product
      if (originalProductUrl && product.moreInfoUrl.includes(originalProductUrl)) {
        originalProductIndex = index;
      }
    });

    return {
      prompt,
      totalResults: products.length,
      suitableProducts: suitableCount,
      unsuitableProducts: unsuitableCount,
      originalProduct: originalProductIndex,
      products,
      warnings
    };
  }

  static formatReportAsTable(report: TestReport): string {
    let output = '\n';
    output += '═'.repeat(100) + '\n';
    output += '                              TEST REPORT\n';
    output += '═'.repeat(100) + '\n\n';
    
    output += `📝 Prompt: ${report.prompt}\n\n`;
    
    output += `📊 Summary:\n`;
    output += `   • Total Results: ${report.totalResults}\n`;
    output += `   • ✅ Suitable Products (AdvancedMC): ${report.suitableProducts}\n`;
    output += `   • ⚠️  Unsuitable Products: ${report.unsuitableProducts}\n\n`;

    // Display warnings if any
    if (report.warnings.length > 0) {
      output += '⚠️  WARNINGS:\n';
      report.warnings.forEach(warning => {
        output += `   ${warning}\n`;
      });
      output += '\n';
    }

    // Product details table
    output += '📦 Product Details:\n';
    output += '─'.repeat(100) + '\n';
    output += '| # | Product Name      | Manufacturer    | Category      | Subcategory   | More Info URL\n';
    output += '─'.repeat(100) + '\n';

    report.products.forEach((product, index) => {
      const num = `${index + 1}`.padEnd(2);
      const name = product.productName.substring(0, 17).padEnd(17);
      const mfg = product.manufacturer.substring(0, 15).padEnd(15);
      const cat = product.category.substring(0, 13).padEnd(13);
      const subcat = product.subcategory.substring(0, 13).padEnd(13);
      const url = product.moreInfoUrl.substring(0, 40);
      
      output += `| ${num} | ${name} | ${mfg} | ${cat} | ${subcat} | ${url}\n`;
    });
    
    output += '─'.repeat(100) + '\n';
    output += '═'.repeat(100) + '\n';

    return output;
  }

  static formatReportAsMarkdown(report: TestReport): string {
    let output = '# Test Report\n\n';
    
    output += `## Prompt\n${report.prompt}\n\n`;
    
    output += '## Summary\n\n';
    output += `- **Total Results**: ${report.totalResults}\n`;
    output += `- **✅ Suitable Products (AdvancedMC)**: ${report.suitableProducts}\n`;
    output += `- **⚠️ Unsuitable Products**: ${report.unsuitableProducts}\n`;
    output += `- **⭐ Original Product Found**: ${report.originalProduct >= 0 ? `Yes (Product #${report.originalProduct + 1})` : 'No'}\n\n`;

    // Warnings
    if (report.warnings.length > 0) {
      output += '## ⚠️ Warnings\n\n';
      report.warnings.forEach(warning => {
        output += `${warning}\n\n`;
      });
    }

    // Products table
    output += '## Product Details\n\n';
    output += '| # | Product Name | Manufacturer | Category | Subcategory | More Info |\n';
    output += '|---|--------------|--------------|----------|-------------|-----------|\n';

    report.products.forEach((product, index) => {
      const isOriginal = index === report.originalProduct;
      const productName = isOriginal ? `⭐ ${product.productName}` : product.productName;
      const productLink = product.moreInfoUrl && product.moreInfoUrl !== 'N/A' && product.moreInfoUrl.startsWith('http') 
        ? `[🔗 View Product](${product.moreInfoUrl})`
        : product.moreInfoUrl;
      
      output += `| ${index + 1} | ${productName} | ${product.manufacturer} | ${product.category} | ${product.subcategory} | ${productLink} |\n`;
    });
    
    if (report.originalProduct >= 0) {
      output += '\n⭐ = Original product that inspired this search\n';
    }

    return output;
  }

  static formatReportAsJSON(report: TestReport): string {
    return JSON.stringify(report, null, 2);
  }
}
