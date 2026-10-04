import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const description='Explore guitar voicings, drop structures, harmonic interpretations, and Ted Greene’s V-System.';
for(const width of [1440,390,320])test(`Four public cards, production title and compact layout ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/');await expect(page.locator('.platform-tool-card')).toHaveCount(4);await expect(page.getByText(description,{exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await mkdir('/tmp/gtl-release-preview',{recursive:true});await page.screenshot({path:`/tmp/gtl-release-preview/home-${width}.png`,fullPage:true});
 await page.goto('/tools');await expect(page.locator('.platform-tool-card')).toHaveCount(4);await expect(page.getByText(description,{exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.getByRole('link',{name:'Open Voicing Explorer',exact:true}).click();await expect(page).toHaveURL(/\/tools\/voicing-explorer$/);await expect(page).toHaveTitle('Voicing Explorer | Guitar Theory Lab');await expect(page.getByTestId('position-pitches')).toHaveAttribute('data-pitches','48,55,59,64');await page.reload();await expect(page.getByRole('heading',{name:'Voicing Explorer',exact:true})).toBeVisible();
});
test('Legacy URL preserves query and hash, and reload uses public canonical route',async({page})=>{
 await page.goto('/tools/voicing-lab?example=greene&root=6#sources');await expect(page).toHaveURL(/\/tools\/voicing-explorer\?example=greene&root=6#sources$/);await expect(page).toHaveTitle('Voicing Explorer | Guitar Theory Lab');await page.reload();await expect(page.getByTestId('position-pitches')).toHaveAttribute('data-pitches','48,55,59,64');
});
test('Four direct tool routes reload without errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));for(const [route,title] of [['set-class-explorer','Set-class Explorer'],['harmonic-intersections','Harmonic Intersections'],['goodrick-voice-leading-visualization','Goodrick Voice Leading Visualization'],['voicing-explorer','Voicing Explorer']]){await page.goto(`/tools/${route}`);await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();}expect(errors).toEqual([]);
});
