import puppeteer from 'puppeteer';
import { Dom } from '@qualweb/dom';
import { Evaluation } from '../dist/index';
import fs from 'fs';

describe('QualWeb evaluation', function () {
  it('Testing qualweb page evaluation', async function () {
    this.timeout(0);

    const url = 'https://ciencias.ulisboa.pt ';

    const browser = await puppeteer.launch({ headless: false, args: ['--ignore-certificate-errors'] });
    const incognito = await browser.createIncognitoBrowserContext();
    const page = await incognito.newPage();
    const dom = new Dom(page);
    const { sourceHtmlHeadContent, validation } = await dom.process(
      {
        waitUntil: ['load', 'networkidle2'],
        execute: { act: true, wcag: true, bp: true },
        'wcag-techniques': { exclude: ['QW-WCAG-T16'] },
        'act-rules': { exclude: ['QW-ACT-R40'] }
      },
      url,
      ''
    );

    const evaluation = new Evaluation(url, page, {
      act: true,
      wcag: true,
      bp: true,
      counter: false,
      wappalyzer: false
    });
    const report = await evaluation.evaluatePage(sourceHtmlHeadContent, {}, validation);

    console.log(report.getFinalReport());

    await page.close();
    await incognito.close();
    await browser.close();
  });
});
